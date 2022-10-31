import abi from '../abi/zkbas.json';

export const contractABI = abi;

// check from /api/v1/layer2BasicInfo
export const ZKBAS_CONTRACT_ADDRESS = '0xda3d6EF63F2712AB1EA300C3ba36e71A8DA49c0a';

export const SUFFIX = '.legend';
export const BNB = 'BNB';
export const BSCTRACE_ACCOUNT_ADDRESS = 'https://bsctrace.com/address/';
export const BSCTRACE_TX_ADDRESS = 'https://bsctrace.com/tx/';

export const ZK_TRACE_ADDRESS = 'https://zk-trace.fe.nodereal.cc';
export const ZK_TRACE_TX_ADDRESS = `${ZK_TRACE_ADDRESS}/transaction/`;
export const ZK_TRACE_ACCOUNT_INDEX_ADDRESS = `${ZK_TRACE_ADDRESS}/account/`;
export const ZK_TRACE_ACCOUNT_ADDRESS = `${ZK_TRACE_ADDRESS}/account/name/`;

export const BSCSCAN_ADDRESS = 'https://testnet.bscscan.com';
export const BSCSCAN_ACCOUNT_ADDRESS = `${BSCSCAN_ADDRESS}/address/`;
export const BSCSCAN_TX_ADDRESS = `${BSCSCAN_ADDRESS}/tx/`;

export const NFT_MARKET_PLACE = 'https://zk-nft-web.fe.nodereal.cc';
export const NFT_MARKET_PLACE_ASSET = `${NFT_MARKET_PLACE}/assets`;

// Chain
// https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain
export const BNBChainId = 97;
export const BNBNet = 'https://data-seed-prebsc-1-s2.binance.org:8545/';

// URL
const TRANSFTER_URL = '/transfer';
export const TRANSFTER_TOKEN_URL = `${TRANSFTER_URL}/token`;
export const TRANSFTER_NFT_URL = `${TRANSFTER_URL}/nft`;
export const LIQUIDITY_URL = '/liquidity';
export const SWAP_URL = '/swap';
export const ACTIVITIES_URL = '/activities';
const DEPOSIT_URL = '/deposit';
export const DEPOSIT_TOKEN_URL = `${DEPOSIT_URL}/token`;
export const DEPOSIT_NFT_URL = `${DEPOSIT_URL}/nft`;
const WITHDRAW_URL = '/withdraw';
export const WITHDRAW_TOKEN_URL = `${WITHDRAW_URL}/token`;
export const WITHDRAW_NFT_URL = `${WITHDRAW_URL}/nft`;

// TABLE
export const TABLE_PAGE_SIZE = 10;
export const INIT_CURRENT_PAGE = 1;

// VAR
export const INVALID_VALUE = -1;
export const ZERO_NFT_PRICE = 'Not Listed';
