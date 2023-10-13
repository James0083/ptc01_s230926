/**
일정 주기로 데이터를 수집, 변환, 저장할 수 있는 배치 어플리케이션을 구현해 주세요.
구글링, chat GPT 등 상관 없음 

## 제약 사항
- Typescript 로 구현
- HTTP 요청 라이브러리는 GOT 이용 하기 
- Node 18 버전 사용 

## 요구사항
- 10분 주기로 Public API 의 캔들 데이터를 가져와 저장하는 배치 어플리케이션을 만들어주세요. (https://docs-en.probit.com/reference/candle) API 문의는 홍소희님에게 
- Event Driven을 이용해 데이터를 가져온 후 캐싱하여 XML, JSON 으로 포맷하여 응답할 수 있는 배치 및 Rest API 어플리케이션을 만들어주세요. 
- 데이터는 중복 저장 되지 않도록 자료구조를 이용하여 구현해 주세요. 
- 최대한의 test coverage를 확보할 수 있도록, 단위 테스트를 작성해 주세요.
- Http status code 500 / 502 / 504 error 발생 시, retry를 최대 3번까지 할 수 있도록 구현해 주세요. 각 네트워크 상태에 따라 Sleep 을 사용해주세요. 
- Logger 인터페이스를 구현해 주세요.
- 배치 실행중 오류(=네트워크 오류 발생 후 재시도횟수를 초과했는데도 요청이 실패한 경우), 어떤 API에서 오류가 발생했는지 몽고DB 에 저장해 주세요.
- 네트워크 오류 발생했을때, 어떤 API에서 오류가 발생했는지 Logging된 정보들은 몽고DB 에 저장해 주세요.
- 배치 실행 중 오류가 발생하여 배치 전체가 멈추는 경우, 어떤 코드에서 오류가 발생했는 지 유추할 수 있는 정보를 로그를 통해 남겨주세요. 배치가 멈췄을 경우 알림 기능을 만들어주세요. SMTP, Slack web hook 상관 없습니다. 
 */

/**
 * - HTTP 요청 : GOT 라이브러리 이용
 * - 배치 및 Rest API
 * - cashing -> XML, JSON 응답
 * - 10분 주기 개별저장 -> number (sequence)
 * - 단위 테스트 작성 : 최대한의 test coverage 확보
 * - Logger 인터페이스 구현 (Interface)
 * - 3번까지 retry (네트워크 상태에 따라 sleep)
 * - 몽고DB
 * - 배치 실행중 오류(재시도 횟수 초과 요청실패) -> 몽고DB저장
 * - 네트워크 오류 -> 몽고DB저장 (어떤 API에서 오류가 발생했는지 Logging된 정보)
 * - 배치 전체가 멈추는 경우 -> 어떤 코드에서 오류가 발생했는지 유추할 수 있는 정보 로깅, 알림기능(SMTP, Slack web hook)
 */

/** Schema
 * logNo : number(sequence)
 * logging : string
 * 
 * ---
 * status : (number?) string
 * code : string
 * message : string
 */