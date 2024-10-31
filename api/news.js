// https://news.deepsearch.com/api/#tag/%EA%B5%AD%EB%82%B4-%EA%B8%B0%EC%82%AC/operation/get_articles_v1_articles_get
//vue.js news(딥서치뉴스 api)용 서버
const express = require('express')  //express import해오기
const news = express.Router() //express router 모듈
const axios = require('axios');

/** 날짜 형식 바꾸는 함수 */
function dateFormat(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}    
const today = new Date();
const formattedToday = dateFormat(today);
const formatted7daysAgo = dateFormat(today - 7 * 24 * 60 * 60 * 1000);

/** 키워드 형식 바꾸는 함수 */
function keywordFormat(raw) {
    return raw.split(' ').join(' OR ');
}
const formattedKeyword = keywordFormat('인공 지능 특이점')
//검색에는 날짜 필요x, 키워드랑 api키만 있어도 됨.

// 'https://api-v2.deepsearch.com/v1/articles?date_from=2024-10-23&date_to=2024-10-24&api_key=2e54407962f548d698a9e69f703b0bad'
const localBaseUrl = 'https://api-v2.deepsearch.com/v1/articles'
const globalBaseUrl = 'https://api-v2.deepsearch.com/v1/global-articles'

const sectionArr = ['politics', 'economy', 'society', 'culture', 'world', 'tech', 'entertainment', 'opinion']
const sectionBaseUrl = `${localBaseUrl}/${sectionArr[0]}`
const defaultParams = {
    api_key: process.env.DEEP_SEARCH_API_KEY,
}
const todayParams = {        
    date_from: formattedToday,
    date_to: formattedToday,
    page_size: 10,    //상위 10개
}

// politics, economy, society, culture, world, tech, entertainment, opinion
// 'https://api-v2.deepsearch.com/v1/articles/
const sectionParams = {
    date_from: formatted7daysAgo,
    date_to: formattedToday,
    page_size: 20,
}

const searchParams = {
    keyword: formattedKeyword,
}

// get요청할 url변수
const baseUrl = '';
const section = sectionArr[0];
switch(world){
    case 'local':
        baseUrl = localBaseUrl
        break;
    case 'global':
        baseUrl = globalBaseUrl
        break;
    default:    //국내
        break;
}

switch(contents){
    case 'main':
        baseUrl + defaultParams + todayParams
        break;
    case 'section':
        `baseUrl+${section}` + defaultParams + sectionParams
        break;
    case 'search':
        baseUrl + defaultParams + searchParams
        break;
}

news.get('/', async function(req, res) {
    const res = await axios.get(localBaseUrl, {params: params});
    res.json(res.data)    
    // const globalRes = await axios.get(globalBaseUrl, {params: params});
    // res.json(globalRes.data)
})


search.get('/', async function(req, res) {
    // 'https://api-v2.deepsearch.com/v1/articles?&api_key=2e54407962f548d698a9e69f703b0bad'
    const res = await axios.get(localBaseUrl, {params: params});
    res.json(res.data)    
    // const globalRes = await axios.get(globalBaseUrl, {params: params});
    // res.json(globalRes.data)
})



module.exports = news;