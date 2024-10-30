//vue.js news(딥서치뉴스 api)용 서버

const express = require('express')  //express import해오기
const news = express.Router() //express router 모듈
const axios = require('axios');

news.get('/', async function(req, res) {

    /** 날짜 형식 바꾸는 함수 */
    function dateFormat(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }    
    const today = new Date();
    const formattedToday = dateFormat(today);

    /** 키워드 형식 바꾸는 함수 */
    function keywordFormat(raw) {
        return raw.split(' ').join(' OR ');
    }
    const formattedKeyword = keywordFormat('인공 지능 특이점')
    //검색에는 날짜 필요x, 키워드랑 api키만 있어도 됨.

    

    const localBaseUrl = 'https://api-v2.deepsearch.com/v1/articles'
    const globalBaseUrl = 'https://api-v2.deepsearch.com/v1/global-articles'
    const sectionArr = [politics, economy, society, culture, world, tech, entertainment, opinion]
    const sectionBaseUrl = `${localBaseUrl}/${sectionArr[0]}`
    const defaultParams = {
        api_key: process.env.DEEP_SEARCH_API_KEY,
    }
    const todayParams = {        
        date_from: formattedToday,
        date_to: formattedToday,
        groupby: 'publisher',  //언론사별
        page_size: 10,    //상위 10개
    }
    const searchParams = {
        keyword: formattedKeyword,
    }

    // 'https://api-v2.deepsearch.com/v1/articles?date_from=2024-10-23&date_to=2024-10-24&api_key=2e54407962f548d698a9e69f703b0bad'
    const localRes = await axios.get(localBaseUrl, {params: params});
    res.json(localRes.data)
    
    // const globalRes = await axios.get(globalBaseUrl, {params: params});
    // res.json(globalRes.data)

})

module.exports = news;