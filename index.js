// express 선언(불러오기)
const express = require('express')  //express import해오기
const app = express() //express 선언
    /**express란? 서버 구축용 웹 프레임워크
     * 미들웨어, 라우팅(get, post,...) 기능을 제공하여 서버 사이드 애플리케이션을 간단하고 효율적으로 구축해줌
     * 서버 사이드 랜더링(SSR) 헬퍼! 
     */

// fs : express 모듈, 데이터 읽고 쓰는 용도(readFileSync, writeFileSync)
// const fs = require('fs');

// cors 선언
var cors = require('cors')
app.use(cors());
    /**cors란? 서버-브라우저(리액트앱) 간 미들웨어
     * 쉽게 설명: http랑 https랑 통신할 수 있게 해줌.
     * 
     * 서버가 적절한 CORS 헤더를 응답에 포함시켜야 브라우저가 다른 출처의 리소스를 허용
     * 같은 출처에서만 데이터를 주고받을 수 있도록 제한함. 이를 우회하기 위해서는 서버에서 명시적으로 허용해줘야 함.
     * 리액트 앱이 API 서버와 통신 시 서버가 CORS를 적절히 설정하지 않으면 브라우저가 보안 이유로 요청을 차단할 수 있음. 이 경우 개발자는 서버 측의 CORS 설정을 조정해야 한다.
     */


//=========================================================================
// [↓] vue.js용 서버==============================================================
const news = require('./api/news');
app.use('/news', news);
// [↑] vue.js용 서버==============================================================
//=========================================================================


// body-parser 선언
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })) //데이터를 form(-submit)에서 받아올 때 처리, url encoded(form데이터는 url에 인코드되어 저장되어 넘어감)
app.use(bodyParser.json())  //데이터를 json형태로 받을 때 처리



// json으로 이미지를 저장할 수는 있지만 데이터가 너무 복잡하고 커짐.
// 이미지, 동영상 등의 미디어는 호스팅하는 서버를 따로 둠.
// ----------------------------------------------------------------- //

//api폴더에서 todos 불러오기
const todos = require('./api/todos');
app.use('/todos', todos)


app.listen(4000)