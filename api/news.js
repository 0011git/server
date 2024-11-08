//vue.js news(딥서치뉴스 api)용 서버

//참고문서
// https://news.deepsearch.com/api/#tag/%EA%B5%AD%EB%82%B4-%EA%B8%B0%EC%82%AC/operation/get_articles_v1_articles_get

//api요청  
// 'https://api-v2.deepsearch.com/v1/articles?date_from=2024-10-23&date_to=2024-10-24&api_key=2e54407962f548d698a9e69f703b0bad'
//  검색에는 날짜 필요x, 키워드랑 api키만 있어도 됨.

const express = require('express')  //express import해오기
const news = express.Router() //express router 모듈
const axios = require('axios');
require('dotenv').config(); // env모듈

/** 날짜 형식 바꾸는 함수 */
function dateFormat(date) {
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}    

/** 키워드 형식 바꾸는 함수 */
function keywordFormat(raw) {
    return raw.split(' ').join(' OR ');
}


news.get('/', async function(req, res){
    const world = req.query.world;  //local or global
    const page = req.query.page;    //main, section, search
    const section = req.query.section;      //politics, economy, ...
    const keyword = req.query.keyword;      //인공 지능 특이점

    const localBaseUrl = 'https://api-v2.deepsearch.com/v1/articles'
    const globalBaseUrl = 'https://api-v2.deepsearch.com/v1/global-articles'

    let pickedBaseUrl = '';
    let params = {
        api_key: process.env.DEEP_SEARCH_API_KEY,
    }

    //날짜 변환
    const today = new Date();
    const formattedToday = dateFormat(today);
    // const formatted7daysAgo = dateFormat(new Date(today - 7 * 24 * 60 * 60 * 1000));
    const formatted30daysAgo = dateFormat(new Date(today - 30 * 24 * 60 * 60 * 1000));

    //검색키워드 변환
    const formattedKeyword = section ? keywordFormat(keyword) : ''

    //국내 or 해외
    switch(world){
        case 'local':
            pickedBaseUrl = localBaseUrl
            break;
        case 'global':
            pickedBaseUrl = globalBaseUrl
            break;
        default:    //국내
            pickedBaseUrl = localBaseUrl
            break;
    }


    //데이터 요청 함수 : fetchMain, fetchSub
    const fetchMain = async (mainUrlRequests) => {      
        const results = {
            today: await Promise.all([...mainUrlRequests.today]),
            section: await Promise.all([...mainUrlRequests.section])

            //국내+해외
            // local:{
                // today: await Promise.all([...mainUrlRequests.local.today]),
                // section: await Promise.all([...mainUrlRequests.local.section])
            // },
            // global:{
            //     today: await Promise.all([...mainUrlRequests.global.today]),
            //     section: await Promise.all([...mainUrlRequests.global.section])
            // }
        }
        return results 
    }

    const fetchSub = async (pickedBaseUrl, params) => {
        //요청
        const resNews = await axios.get(pickedBaseUrl, {params});
        return resNews.data;
    }

    // [↓] 실행 ----------------------------------------
    //페이지 별로 구분해서 요청하기
    switch(page){
        case 'main':    // 요청 9번!  (원래는 국내해외 둘다 해서 18번 넣었는데 월 횟수제한이 300회라 선택한 것 하나만 하기로 함)
            params = {
                ...params,
                page_size: 14,
                date_from: formattedToday,
                date_to: formattedToday
            }

            //받아올 데이터 기본 형태
            let mainUrlRequests = 
            { 
                today, 
                section
            };
            // 1. 오늘의 뉴스
            mainUrlRequests.today.push(axios.get(pickedBaseUrl, { params: params}));
            
            // 2. 섹션별(기본:politics)
            mainUrlRequests.section.push(axios.get(`${pickedBaseUrl}/politics`, { params: params}))

            const results = await fetchMain(mainUrlRequests)

            res.json({
                today: results.today.map(response => response.data),
                section: results.section.map((response, index) => response.data)
            });

            break;

        case 'section':
            pickedBaseUrl += `/${section}`;
            params = {
                ...params, 
                date_from: formattedToday,
                date_to: formattedToday
            }
            res.json( await fetchSub(pickedBaseUrl, params) )
            break;

        case 'search':
            params = {
                ...params,
                keyword: formattedKeyword
            }
            res.json( await fetchSub(pickedBaseUrl, params) )
            break;

        default:
            break;
    }

});

module.exports = news;