module.exports = {
    blockprocessed,
    get,
    getByHash,
    skipToLastUnprocessedByHash,
    skipToLastUnprocessed,
    markBlockasProcessed,
    saveProcessesBlocks
};


const logger = require('./logger');
const series = require('./util/series');
const saveOrUpate = require('./util/saveUpdate');
const models = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const processdBlocks = {};
const MINCONFIRMED = 6;


function blockprocessed(blocknumber, currency, blocktime, blockhash) {
    if (!blocknumber) throw new Error('crawledblock: blocknumber not defined');
    if (!currency) throw new Error('crawledblock: currency not defined');
    if (!blocktime) throw new Error('crawledblock: blocktime not defined');
    if (!blockhash) throw new Error('crawledblock: blockhash not defined');

    const crawledblock = {
        blocknumber: blocknumber,
        currency: currency,
        blocktime: blocktime,
        blockhash: blockhash,
    };

    const options = {
        where: {
            blockhash: blockhash
        }
    };
    return saveOrUpate.saveOrUpdate(crawledblock, options, models.Crawledblocks);
}



function get(blocknumber, currency) {
    if (!blocknumber) throw new Error('crawledblock: no blocknumber defined');
    if (!currency) throw new Error('crawledblock: no currency defined');

    return models.Crawledblocks.find({
            where: {
                blocknumber: blocknumber,
                currency: currency
            }
        })
        .then((blk) =>  {
            if (!blk) return null;
            return blk.dataValues;
        });

}

function getByHash(blockhash, currency) {
    if (!blockhash) throw new Error('crawledblock: no blockhash defined');
    if (!currency) throw new Error('crawledblock: no currency defined');
    return models.Crawledblocks.find({
            where: {
                blockhash: blockhash,
                currency: currency
            }
        })
        .then((blk) =>  {
            if (!blk) return null;
            return blk.dataValues;
        });

}

function skipToLastUnprocessedByHash(hash, time, currency) {
    if (!hash) throw new Error('crawledblock: no hash defined');
    if (!time) throw new Error('crawledblock: no time defined');
    if (!currency) throw new Error('crawledblock: no currency defined');
    logger.info('checking block hash', hash);
    return getByHash(hash, currency)
        .then((block) => {
            if (!block) {
                return { blockhash: hash };
            }
            let p = block.blocknumber;
            return skipToLastUnprocessed(p, time, currency);
        })

}

function skipToLastUnprocessed(blocknumber, time, currency, lastDBEntry) {
    if (!blocknumber) throw new Error('crawledblock: no blocknumber defined');
    if (!time) throw new Error('crawledblock: no time defined');
    if (!currency) throw new Error('crawledblock: no currency defined');
    logger.info('skiping block number', blocknumber);
    return get(blocknumber, currency)
        .then((block) => {
            if (!block) {
                if (lastDBEntry) return lastDBEntry;
                return {
                    blocknumber: blocknumber
                };
            }
            if (block.blocktime < time * 1000) {
                return block;
            }

            let prev = block.blocknumber - 1;
            return skipToLastUnprocessed(prev, time, currency, block);
        });
}

function markBlockasProcessed(block, currency, bestheight) {
    if (!block) throw new Error('crawledblock: no block defined');
    if (!currency) throw new Error('crawledblock: no currency defined');
    if (!bestheight) throw new Error('crawledblock: no bestheight defined');
    if (bestheight - MINCONFIRMED > block.height) {
        if (!processdBlocks[currency]) processdBlocks[currency] = [];
        processdBlocks[currency].push(block);
    }
}

function saveProcessesBlocks(currency) {
    if (!currency) throw new Error('crawledblock: no currency defined');
    if (!processdBlocks[currency]) processdBlocks[currency] = [];
    return series.forEach(processdBlocks[currency], 0, (block) => {
            return blockprocessed(block.height, currency, block.time * 1000, block.hash);
        })
        .then(() => {
            processdBlocks[currency] = [];
        });

}