
# Description

## ptc01_s230926
 
일정 주기로 데이터를 수집, 변환, 저장할 수 있는 배치 어플리케이션을 구현.
구글링, chat GPT 등 상관 없음 

### 제약 사항
- Typescript 로 구현
- HTTP 요청 라이브러리는 GOT 이용 하기 
- Node 18 버전 사용 

### 요구사항
- [X] 10분 주기로 Public API 의 캔들 데이터를 가져와 저장하는 배치 어플리케이션. (https://docs-en.probit.com/reference/candle) 
- [ ] Event Driven을 이용해 데이터를 가져온 후 캐싱하여 XML, JSON 으로 포맷하여 응답할 수 있는 배치 및 Rest API 어플리케이션 구현. 
- [X] 데이터는 중복 저장 되지 않도록 자료구조를 이용. 
- [ ] 최대한의 test coverage를 확보할 수 있도록, 단위 테스트를 작성.
- [ ] Http status code 500 / 502 / 504 error 발생 시, retry를 최대 3번까지 할 수 있도록 구현. 각 네트워크 상태에 따라 Sleep 을 사용. 
- [ ] 배치 실행중 오류(=네트워크 오류 발생 후 재시도횟수를 초과했는데도 요청이 실패한 경우), 어떤 API에서 오류가 발생했는지 몽고DB 에 저장.
- [X] Logger 인터페이스를 구현.
- [X] 네트워크 오류 발생했을때, 어떤 API에서 오류가 발생했는지 Logging된 정보들은 몽고DB 에 저장.
- [X] 배치 실행 중 오류가 발생하여 배치 전체가 멈추는 경우, 어떤 코드에서 오류가 발생했는 지 유추할 수 있는 정보를 로그를 통해 남기기. 배치가 멈췄을 경우 알림 기능을 만들기. SMTP, Slack web hook 상관 없음. 

# Running the app

```bash
# development
$ npm run dev
```

# Test
(mongoDB 테스트 부분 에러 있어서 api요청 부분만 테스트함)
```bash
# unit tests
$ npm test
```
