// express 선언(불러오기)
const express = require('express')  //express import해오기
const todos = express.Router() //express router 모듈

// fs : express 모듈, 데이터 읽고 쓰는 용도(readFileSync, writeFileSync)
const fs = require('fs');

let data = fs.readFileSync('./db/data.json'); //data.json을 가져와서 
let parsedData = JSON.parse(data); //다시 json형태로 parse하기

//전체 데이터 가져오기(GET)-------------------------------------------------------------------------
todos.get('/', function (req, res) {  //req: request, res:response
  res.send(parsedData)
})
//id가 일치하는 데이터만 가져오기(GET)-------------------------------------------------------------------------
todos.get('/:id', function (req, res) {   //루트 디렉토리의 주소 뒷부분(http://localhost:4000//뒷부분)을 받아서 id변수에 저장
    let {id} = req.params;    //req.params에 주소로 쓸 변수값이 들어옴. {id: 값} 형태임.

    let body = parsedData.list.filter((obj) => obj.id == id);  
    //obj.id는 json에서 뽑아온 number타입, id는 리퀘스트로 받아온 string타입

    // console.log(body);
    res.send({list:body});   //전체 data.json 보내줌
})
// 데이터 추가하기(POST)-------------------------------------------------------------------------
todos.post('/', function (req, res) {
    // let body = {list:[...parsedData.list, req.body]};   // {list:[... 원래 json형식 유지용
    let body = [req.body, ...parsedData.list];      //이 코드는 아래 res.send에서 {list:body}로 원래 json형식을 유지하고 있음
    fs.writeFileSync('./db/data.json', JSON.stringify({list:body}));
    // console.log(req.body);  //수정한 데이터만 보내줌
    // console.log(body);
    res.send({list:body}) //수정된 전체 data.json 보내줌
})

// 데이터 수정하기(PUT)-------------------------------------------------------------------------
todos.put('/', function (req, res) {
  let {id, status} = req.body; //리퀘스트로 받아온 id, name값

  // let body = parsedData.list.map((obj) => {    //←이 코드랑
  let body = [...parsedData.list].map((obj) => {  //←이 코드랑 동일!

    if(obj.id == id){ //obj.id는 json에서 뽑아온 number타입, id는 리퀘스트로 받아온 string타입
      obj.status = status;
    }
    return obj;

  })

  fs.writeFileSync('./db/data.json', JSON.stringify({list:body}));  //{list:body} 원래 json형식 유지용
  // console.log(body);
  // res.send(req.body)  //수정한 데이터만 보내줌
  res.send({list:body})  //수정된 전체 data.json 보내줌
})

//데이터 삭제하기(DELETE)-------------------------------------------------------------------------
todos.delete('/', function (req, res) {
  //DELETE는 
  let {id} = req.query;  //리퀘스트로 받아온(주소창에서 가져온 = query)id값
  let body = [...parsedData.list].filter((obj) => obj.id != id); //아이디가 같지 않은 데이터만 추출 = 아이디가 같은 것만 삭제하는 효과!
  fs.writeFileSync('./db/data.json', JSON.stringify({list:body})); //{list:body} 원래 json형식 유지용
  console.log(req.query);
  // res.send(req.body)  //수정한 데이터만 보내줌
  res.send({list:body});  //수정된 전체 data.json 보내줌
})


module.exports = todos;