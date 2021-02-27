/*! 
 * alpaca@5.0.5
 * released under the permissive ISC license
 */

import Bottleneck from 'bottleneck';
import qs from 'qs';
import isofetch from 'isomorphic-unfetch';
import WebSocket from 'isomorphic-ws';
import EventEmitter from 'eventemitter3';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var urls = {
    rest: {
        account: 'https://api.alpaca.markets/v2',
        market_data: 'https://data.alpaca.markets/v2',
    },
    websocket: {
        account: 'wss://api.alpaca.markets/stream',
        account_paper: 'wss://paper-api.alpaca.markets/stream',
        market_data: (source) => `wss://stream.data.alpaca.markets/v2/${source}`,
    },
};

function account(rawAccount) {
    if (!rawAccount) {
        return undefined;
    }
    try {
        return Object.assign(Object.assign({}, rawAccount), { raw: () => rawAccount, buying_power: number(rawAccount.buying_power), regt_buying_power: number(rawAccount.regt_buying_power), daytrading_buying_power: number(rawAccount.daytrading_buying_power), cash: number(rawAccount.cash), created_at: new Date(rawAccount.created_at), portfolio_value: number(rawAccount.portfolio_value), multiplier: number(rawAccount.multiplier), equity: number(rawAccount.equity), last_equity: number(rawAccount.last_equity), long_market_value: number(rawAccount.long_market_value), short_market_value: number(rawAccount.short_market_value), initial_margin: number(rawAccount.initial_margin), maintenance_margin: number(rawAccount.maintenance_margin), last_maintenance_margin: number(rawAccount.last_maintenance_margin), sma: number(rawAccount.sma), status: rawAccount.status });
    }
    catch (err) {
        throw new Error(`Account parsing failed. ${err.message}`);
    }
}
function clock(rawClock) {
    if (!rawClock) {
        return undefined;
    }
    try {
        return {
            raw: () => rawClock,
            timestamp: new Date(rawClock.timestamp),
            is_open: rawClock.is_open,
            next_open: new Date(rawClock.next_open),
            next_close: new Date(rawClock.next_close),
        };
    }
    catch (err) {
        throw new Error(`Order parsing failed. ${err.message}`);
    }
}
function order(rawOrder) {
    if (!rawOrder) {
        return undefined;
    }
    try {
        return Object.assign(Object.assign({}, rawOrder), { raw: () => rawOrder, created_at: new Date(rawOrder.created_at), updated_at: new Date(rawOrder.updated_at), submitted_at: new Date(rawOrder.submitted_at), filled_at: new Date(rawOrder.filled_at), expired_at: new Date(rawOrder.expired_at), canceled_at: new Date(rawOrder.canceled_at), failed_at: new Date(rawOrder.failed_at), replaced_at: new Date(rawOrder.replaced_at), qty: number(rawOrder.qty), filled_qty: number(rawOrder.filled_qty), type: rawOrder.type, side: rawOrder.side, time_in_force: rawOrder.time_in_force, limit_price: number(rawOrder.limit_price), stop_price: number(rawOrder.stop_price), filled_avg_price: number(rawOrder.filled_avg_price), status: rawOrder.status, legs: orders(rawOrder.legs), trail_price: number(rawOrder.trail_price), trail_percent: number(rawOrder.trail_percent), hwm: number(rawOrder.hwm) });
    }
    catch (err) {
        throw new Error(`Order parsing failed. ${err.message}`);
    }
}
function orders(rawOrders) {
    return rawOrders ? rawOrders.map((value) => order(value)) : undefined;
}
function canceled_order(input) {
    if (!input) {
        return undefined;
    }
    let order = input.body;
    delete input.body;
    try {
        return Object.assign(Object.assign({}, input), { order: Object.assign(Object.assign({}, order), { raw: () => order, created_at: new Date(order.created_at), updated_at: new Date(order.updated_at), submitted_at: new Date(order.submitted_at), filled_at: new Date(order.filled_at), expired_at: new Date(order.expired_at), canceled_at: new Date(order.canceled_at), failed_at: new Date(order.failed_at), replaced_at: new Date(order.replaced_at), qty: number(order.qty), filled_qty: number(order.filled_qty), type: order.type, side: order.side, time_in_force: order.time_in_force, limit_price: number(order.limit_price), stop_price: number(order.stop_price), filled_avg_price: number(order.filled_avg_price), status: order.status, legs: orders(order.legs), trail_price: number(order.trail_price), trail_percent: number(order.trail_percent), hwm: number(order.hwm) }) });
    }
    catch (err) {
        throw new Error(`Order parsing failed. ${err.message}`);
    }
}
function canceled_orders(rawOrderCancelations) {
    return rawOrderCancelations
        ? rawOrderCancelations.map((value) => canceled_order(value))
        : undefined;
}
function position(rawPosition) {
    if (!rawPosition) {
        return undefined;
    }
    try {
        return Object.assign(Object.assign({}, rawPosition), { raw: () => rawPosition, avg_entry_price: number(rawPosition.avg_entry_price), qty: number(rawPosition.qty), side: rawPosition.side, market_value: number(rawPosition.market_value), cost_basis: number(rawPosition.cost_basis), unrealized_pl: number(rawPosition.unrealized_pl), unrealized_plpc: number(rawPosition.unrealized_plpc), unrealized_intraday_pl: number(rawPosition.unrealized_intraday_pl), unrealized_intraday_plpc: number(rawPosition.unrealized_intraday_plpc), current_price: number(rawPosition.current_price), lastday_price: number(rawPosition.lastday_price), change_today: number(rawPosition.change_today) });
    }
    catch (err) {
        throw new Error(`Position parsing failed. ${err.message}`);
    }
}
function positions(rawPositions) {
    return rawPositions ? rawPositions.map((pos) => position(pos)) : undefined;
}
function tradeActivity(rawTradeActivity) {
    if (!rawTradeActivity) {
        return undefined;
    }
    try {
        return Object.assign(Object.assign({}, rawTradeActivity), { raw: () => rawTradeActivity, cum_qty: number(rawTradeActivity.cum_qty), leaves_qty: number(rawTradeActivity.leaves_qty), price: number(rawTradeActivity.price), qty: number(rawTradeActivity.qty), side: rawTradeActivity.side, type: rawTradeActivity.type });
    }
    catch (err) {
        throw new Error(`TradeActivity parsing failed. ${err.message}`);
    }
}
function nonTradeActivity(rawNonTradeActivity) {
    if (!rawNonTradeActivity) {
        return undefined;
    }
    try {
        return Object.assign(Object.assign({}, rawNonTradeActivity), { raw: () => rawNonTradeActivity, net_amount: number(rawNonTradeActivity.net_amount), qty: number(rawNonTradeActivity.qty), per_share_amount: number(rawNonTradeActivity.per_share_amount) });
    }
    catch (err) {
        throw new Error(`NonTradeActivity parsing failed. ${err.message}`);
    }
}
function activities(rawActivities) {
    if (!rawActivities) {
        return undefined;
    }
    try {
        return rawActivities.map((rawActivity) => rawActivity.activity_type === 'FILL'
            ? tradeActivity(rawActivity)
            : nonTradeActivity(rawActivity));
    }
    catch (err) {
        throw new Error(`Activity parsing failed. ${err.message}`);
    }
}
function pageOfTrades(page) {
    if (!page) {
        return undefined;
    }
    try {
        return {
            raw: () => page,
            trades: page.trades.map((trade) => (Object.assign(Object.assign({ raw: () => trade }, trade), { t: new Date(trade.t) }))),
            symbol: page.symbol,
            next_page_token: page.next_page_token,
        };
    }
    catch (err) {
        throw new Error(`PageOfTrades parsing failed "${err.message}"`);
    }
}
function pageOfQuotes(page) {
    if (!page) {
        return undefined;
    }
    try {
        return {
            raw: () => page,
            quotes: page.quotes.map((quote) => (Object.assign(Object.assign({ raw: () => quote }, quote), { t: new Date(quote.t) }))),
            symbol: page.symbol,
            next_page_token: page.next_page_token,
        };
    }
    catch (err) {
        throw new Error(`PageOfTrades parsing failed "${err.message}"`);
    }
}
function pageOfBars(page) {
    if (!page) {
        return undefined;
    }
    try {
        return {
            raw: () => page,
            bars: page.bars.map((bar) => (Object.assign(Object.assign({ raw: () => bar }, bar), { t: new Date(bar.t) }))),
            symbol: page.symbol,
            next_page_token: page.next_page_token,
        };
    }
    catch (err) {
        throw new Error(`PageOfTrades parsing failed "${err.message}"`);
    }
}
function number(numStr) {
    if (typeof numStr === 'undefined')
        return numStr;
    return parseFloat(numStr);
}
var parse = {
    account,
    activities,
    clock,
    nonTradeActivity,
    order,
    orders,
    canceled_orders,
    position,
    positions,
    tradeActivity,
    pageOfTrades,
    pageOfQuotes,
    pageOfBars,
};

const unifetch = typeof fetch !== 'undefined' ? fetch : isofetch;
class AlpacaClient {
    constructor(params) {
        this.params = params;
        this.limiter = new Bottleneck({
            reservoir: 200,
            reservoirRefreshAmount: 200,
            reservoirRefreshInterval: 60 * 1000,
            maxConcurrent: 1,
            minTime: 200,
        });
        if (!('paper' in params.credentials) &&
            !('key' in params.credentials && params.credentials.key.startsWith('A'))) {
            params.credentials['paper'] = true;
        }
        if ('access_token' in params.credentials &&
            ('key' in params.credentials || 'secret' in params.credentials)) {
            throw new Error("can't create client with both default and oauth credentials");
        }
    }
    isAuthenticated() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getAccount();
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    getAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.account(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/account`,
            }));
        });
    }
    getOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.order(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/orders/${params.order_id || params.client_order_id}`,
                data: { nested: params.nested },
            }));
        });
    }
    getOrders(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.orders(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/orders`,
                data: params,
            }));
        });
    }
    placeOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.order(yield this.request({
                method: 'POST',
                url: `${urls.rest.account}/orders`,
                data: params,
            }));
        });
    }
    replaceOrder(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.order(yield this.request({
                method: 'PATCH',
                url: `${urls.rest.account}/orders/${params.order_id}`,
                data: params,
            }));
        });
    }
    cancelOrder(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls.rest.account}/orders/${params.order_id}`,
        });
    }
    cancelOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.canceled_orders(yield this.request({
                method: 'DELETE',
                url: `${urls.rest.account}/orders`,
            }));
        });
    }
    getPosition(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.position(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/positions/${params.symbol}`,
            }));
        });
    }
    getPositions() {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.positions(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/positions`,
            }));
        });
    }
    closePosition(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.order(yield this.request({
                method: 'DELETE',
                url: `${urls.rest.account}/positions/${params.symbol}`,
            }));
        });
    }
    closePositions() {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.orders(yield this.request({
                method: 'DELETE',
                url: `${urls.rest.account}/positions`,
            }));
        });
    }
    getAsset(params) {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/assets/${params.asset_id_or_symbol}`,
        });
    }
    getAssets(params) {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/assets`,
            data: params,
        });
    }
    getWatchlist(params) {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/watchlists/${params.uuid}`,
        });
    }
    getWatchlists() {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/watchlists`,
        });
    }
    createWatchlist(params) {
        return this.request({
            method: 'POST',
            url: `${urls.rest.account}/watchlists`,
            data: params,
        });
    }
    updateWatchlist(params) {
        return this.request({
            method: 'PUT',
            url: `${urls.rest.account}/watchlists/${params.uuid}`,
            data: params,
        });
    }
    addToWatchlist(params) {
        return this.request({
            method: 'POST',
            url: `${urls.rest.account}/watchlists/${params.uuid}`,
            data: params,
        });
    }
    removeFromWatchlist(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls.rest.account}/watchlists/${params.uuid}/${params.symbol}`,
        });
    }
    deleteWatchlist(params) {
        return this.request({
            method: 'DELETE',
            url: `${urls.rest.account}/watchlists/${params.uuid}`,
        });
    }
    getCalendar(params) {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/calendar`,
            data: params,
        });
    }
    getClock() {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.clock(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/clock`,
            }));
        });
    }
    getAccountConfigurations() {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/account/configurations`,
        });
    }
    updateAccountConfigurations(params) {
        return this.request({
            method: 'PATCH',
            url: `${urls.rest.account}/account/configurations`,
            data: params,
        });
    }
    getAccountActivities(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.activity_types && Array.isArray(params.activity_types)) {
                params.activity_types = params.activity_types.join(',');
            }
            return parse.activities(yield this.request({
                method: 'GET',
                url: `${urls.rest.account}/account/activities${params.activity_type ? '/'.concat(params.activity_type) : ''}`,
                data: Object.assign(Object.assign({}, params), { activity_type: undefined }),
            }));
        });
    }
    getPortfolioHistory(params) {
        return this.request({
            method: 'GET',
            url: `${urls.rest.account}/account/portfolio/history`,
            data: params,
        });
    }
    getTrades(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.pageOfTrades(yield this.request({
                method: 'GET',
                url: `${urls.rest.market_data}/stocks/${params.symbol}/trades`,
                data: Object.assign(Object.assign({}, params), { symbol: undefined }),
            }));
        });
    }
    getQuotes(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.pageOfQuotes(yield this.request({
                method: 'GET',
                url: `${urls.rest.market_data}/stocks/${params.symbol}/quotes`,
                data: Object.assign(Object.assign({}, params), { symbol: undefined }),
            }));
        });
    }
    getBars(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return parse.pageOfBars(yield this.request({
                method: 'GET',
                url: `${urls.rest.market_data}/stocks/${params.symbol}/bars`,
                data: Object.assign(Object.assign({}, params), { symbol: undefined }),
            }));
        });
    }
    request(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let headers = {};
            if ('access_token' in this.params.credentials) {
                headers['Authorization'] = `Bearer ${this.params.credentials.access_token}`;
            }
            else {
                headers['APCA-API-KEY-ID'] = this.params.credentials.key;
                headers['APCA-API-SECRET-KEY'] = this.params.credentials.secret;
                if (this.params.credentials.paper) {
                    params.url = params.url.replace('api.', 'paper-api.');
                }
            }
            for (let [key, value] of Object.entries(params.data)) {
                if (value instanceof Date) {
                    params.data[key] = value.toISOString();
                }
            }
            let query = '';
            if (params.data) {
                if (params.method != 'POST' && params.method != 'PATCH') {
                    query = '?'.concat(qs.stringify(params.data));
                    params.data = undefined;
                }
            }
            const makeCall = () => unifetch(params.url.concat(query), {
                method: params.method,
                headers,
                body: JSON.stringify(params.data),
            }), func = this.params.rate_limit
                ? () => this.limiter.schedule(makeCall)
                : makeCall;
            let resp, result = {};
            try {
                resp = yield func();
                if (!(params.isJson != undefined ? false : params.isJson)) {
                    return resp.ok;
                }
                result = yield resp.json();
            }
            catch (e) {
                console.error(e);
                throw result;
            }
            if ('code' in result || 'message' in result) {
                throw result;
            }
            return result;
        });
    }
}

class AlpacaStream extends EventEmitter {
    constructor(params) {
        super();
        this.params = params;
        this.subscriptions = [];
        this.authenticated = false;
        switch (params.stream) {
            case 'account':
                this.host = params.credentials.key.startsWith('PK')
                    ? urls.websocket.account_paper
                    : urls.websocket.account;
                break;
            case 'market_data':
                break;
            default:
                this.host = 'unknown';
        }
        this.connection = new WebSocket(this.host);
        this.connection.onopen = () => {
            if (!this.authenticated) {
                this.connection.send(JSON.stringify({
                    action: 'authenticate',
                    data: {
                        key_id: params.credentials.key,
                        secret_key: params.credentials.secret,
                    },
                }));
            }
            this.emit('open', this);
        };
        this.connection.onclose = () => this.emit('close', this);
        this.connection.onmessage = (message) => {
            const object = JSON.parse(message.data);
            if ('stream' in object && object.stream == 'authorization') {
                if (object.data.status == 'authorized') {
                    this.authenticated = true;
                    this.emit('authenticated', this);
                    console.log('Connected to the websocket.');
                }
                else {
                    this.connection.close();
                    throw new Error('There was an error in authorizing your websocket connection. Object received: ' +
                        JSON.stringify(object, null, 2));
                }
            }
            this.emit('message', object);
            if ('stream' in object) {
                const x = {
                    trade_updates: 'trade_updates',
                    account_updates: 'account_updates',
                    T: 'trade',
                    Q: 'quote',
                    AM: 'aggregate_minute',
                };
                this.emit(x[object.stream.split('.')[0]], object.data);
            }
        };
        this.connection.onerror = (err) => {
            this.emit('error', err);
        };
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    send(message) {
        if (!this.authenticated) {
            throw new Error("You can't send a message until you are authenticated!");
        }
        if (typeof message == 'object') {
            message = JSON.stringify(message);
        }
        this.connection.send(message);
        return this;
    }
    subscribe(channels) {
        this.subscriptions.push(...channels);
        return this.send(JSON.stringify({
            action: 'listen',
            data: {
                streams: channels,
            },
        }));
    }
    unsubscribe(channels) {
        for (let i = 0, ln = this.subscriptions.length; i < ln; i++) {
            if (channels.includes(this.subscriptions[i])) {
                this.subscriptions.splice(i, 1);
            }
        }
        return this.send(JSON.stringify({
            action: 'unlisten',
            data: {
                streams: channels,
            },
        }));
    }
}

var index = {
    AlpacaClient: AlpacaClient,
    AlpacaStream: AlpacaStream,
};

export default index;
export { AlpacaClient, AlpacaStream };
//# sourceMappingURL=alpaca.js.map
