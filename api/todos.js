// express 선언(불러오기)
const express = require('express')  //express import해오기
const todos = express.Router() //express router 모듈

/**Mongo DB 몽고 DB 서버 생성하기
#몽고DB
1. database 프로젝트 생성
2. browse connect
3. database 생성
4. collection 생성

#서버
1. npm i mongodb(설치)
2. https://www.npmjs.com/package/mongodb 예제코드 확인(find, insert, update, delete)
3. 코드 수정

#Vercel(배포)
1. 서버 배포
2. 인테그레이션(integration): 몽고 디비 접근 설정
3. setting: 서버 접속 국가 변경


#프론트
1. database - Browse Collection 클릭
2. 새로고침 하면서 DB 인앤아웃 확인
*/


//몽고db import
const { MongoClient } = require('mongodb'); //메소드 import
const url = 'mongodb+srv://0125sjy:OPMqjdMbJFSTF04F@cluster0.s86pi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';  
                    //내 비번 들어간 url주소
const client = new MongoClient(url);
const dbName = 'todos'; //내가 설정한 db이름

async function mongoConnect() { //몽고db여는 함수
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('data'); //todos 하위의 data에 접근
  return;
  // const findResult = await collection.find({}).toArray();
  // res.send(findResult)
}


//전체 데이터 가져오기(GET)-------------------------------------------------------------------------
todos.get('/', async function (req, res) {  //req: request, res:response
    //내 로컬호스트 data.json파일(fs.용)
    // res.send(parsedData)

    //몽고db => mongoConnect 함수로 만들어둠
    // await client.connect();
    // console.log('Connected successfully to server');
    // const db = client.db(dbName);
    // const collection = db.collection('data');     
  //----------------------------------------------------------------------
    //몽고db : find
    const collection = await mongoConnect();  //db접속
    const findResult = await collection.find({}).toArray(); //db가져오기
    // client.close(); //서버 끊기 : 속도 느려서 서버 닫지 않음
    res.send(findResult);

})
//id가 일치하는 데이터만 가져오기(GET)-------------------------------------------------------------------------
todos.get('/:id', async function (req, res) {   //루트 디렉토리의 주소 뒷부분(http://localhost:4000//뒷부분)을 받아서 id변수에 저장
    //내 로컬호스트 data.json파일(fs.용)
    // let {id} = req.params;    //req.params에 주소로 쓸 변수값이 들어옴. {id: 값} 형태임.
    // let body = parsedData.list.filter((obj) => obj.id == id);  
    // //obj.id는 json에서 뽑아온 number타입, id는 리퀘스트로 받아온 string타입
    // res.send({list:body});   //전체 data.json 보내줌
  //---------------------------------------------------
    //몽고db : find
    let {id} = req.params;    //req.params에 주소로 쓸 변수값이 들어옴. {id: 값} 형태임.
    const collection = await mongoConnect();
    const findResult = await collection.find(id).toArray();
    // client.close(); //서버 끊기
    res.send(findResult);

})
// 데이터 추가하기(POST)-------------------------------------------------------------------------
todos.post('/', async function (req, res) {
    //내 로컬호스트 data.json파일(fs.용)
    // let body = {list:[...parsedData.list, req.body]};   // (1) {list:[... 원래 json형식 유지용
    // let body = [req.body, ...parsedData.list];         //  (2) 이 코드는 아래 res.send에서 {list:body}로 원래 json형식을 유지하고 있음
                                                  // ====>>>(1)이랑 (2)랑 같은거!
    // fs.writeFileSync('./db/data.json', JSON.stringify({list:body}));
    // console.log(body);
    // res.send(req.body);  //수정한 데이터만 보내줌
    // res.send({list:body}) //수정된 전체 data.json 보내줌
  //-------------------------------------------------
  //몽고db : insertOne
    const collection = await mongoConnect();
    await collection.insertOne(req.body);  //추가한 데이터 저장
    const findResult = await collection.find({}).toArray();  //수정된 데이터 다시 가져와서 저장
    // client.close(); //서버 끊기
    res.send(findResult); //서버로 보내기
})

// 데이터 수정하기(PUT)-------------------------------------------------------------------------
todos.put('/', async function (req, res) {
  //내 로컬호스트 data.json파일(fs.용)
  // let {id, status} = req.body; //리퀘스트로 받아온 id, name값
  // // let body = parsedData.list.map((obj) => {    //←이 코드랑
  // let body = [...parsedData.list].map((obj) => {  //←이 코드랑 동일!
  //   if(obj.id == id){ //obj.id는 json에서 뽑아온 number타입, id는 req로 받아온 string타입
  //     obj.status = status;
  //   }
  //   return obj;
  // })
  // fs.writeFileSync('./db/data.json', JSON.stringify({list:body}));  //{list:body} 원래 json형식 유지용
  // // console.log(body);
  // // res.send(req.body)  //수정한 데이터만 보내줌
  // res.send({list:body})  //수정된 전체 data.json 보내줌
//----------------------------------------------------{id:li.id, status:!li.status}
//몽고db : updateOne
  const collection = await mongoConnect();
  await collection.updateOne({id:req.body.id}, {$set:req.body.status});  //데이터 수정{찾을id, 인덱스값}, {수정할값}
  const findResult = await collection.find({}).toArray();  //다시 데이터 가져와서 저장
  // client.close(); //서버 끊기

  res.send(findResult); //서버로 보내기
})


//데이터 삭제하기(DELETE)-------------------------------------------------------------------------
todos.delete('/', async function (req, res) {
  //내 로컬호스트 data.json파일(fs.용)
  //DELETE는 
  // let {id} = req.query;  //리퀘스트로 받아온(주소창에서 가져온 = query)id값
  // let body = [...parsedData.list].filter((obj) => obj.id != id); //아이디가 같지 않은 데이터만 추출 = 아이디가 같은 것만 삭제하는 효과!
  // fs.writeFileSync('./db/data.json', JSON.stringify({list:body})); //{list:body} 원래 json형식 유지용
  // console.log(req.query);
  // // res.send(req.body)  //수정한 데이터만 보내줌
  // res.send({list:body});  //수정된 전체 data.json 보내줌
//--------------------------------------------------------
//몽고db : deleteOne
  let id = req.query;  //리퀘스트로 받아온(주소창에서 가져온 = query)id값
  const collection = await mongoConnect();
  await collection.deleteOne(id);  //데이터 삭제{찾을id}
  const findResult = await collection.find({}).toArray();  //다시 데이터 가져와서 저장
  // client.close(); //서버 끊기
  res.send(findResult); //서버로 보내기
})


module.exports = todos;