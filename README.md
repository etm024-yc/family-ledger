# 우리집 가계부

영철과 경진이 함께 쓰는 모바일 가계부입니다. `index.html`을 브라우저에서 열면 바로 쓸 수 있고, 배포하면 휴대폰 홈 화면에 앱처럼 추가할 수 있습니다.

## 지금 들어있는 기능

- 달력, 입력, 분석, 설정 화면
- 지출/수입/고정 지출/고정 수입 입력
- 자동 입력 저장, 수정, 삭제
- 영철/경진 사용자 분리
- 사용자별 카드 소유 분리
- 카드 대금 참고 표시와 카드 대금 분석
- 월별 배정 예산과 이월 분석
- JSON 내보내기/가져오기
- PWA 설치용 `manifest.webmanifest`, `sw.js`
- Google Drive 동기화용 Apps Script 예제 `google-drive-sync.gs`

## 휴대폰에서 쓰는 전체 흐름

1. 앱 파일을 인터넷에서 열 수 있는 곳에 올립니다.
   - 추천: GitHub Pages, Netlify, Cloudflare Pages 중 하나
   - 휴대폰 홈 화면 추가는 보통 HTTPS 주소에서 가장 안정적입니다.

2. Google Drive에 동기화 파일을 저장할 폴더를 만듭니다.
   - 예: `우리집 가계부`
   - 영철/경진 둘 다 접근 가능한 공유 폴더면 됩니다.

3. Google Apps Script를 만듭니다.
   - <https://script.google.com/> 접속
   - 새 프로젝트 생성
   - `google-drive-sync.gs` 내용을 붙여넣기
   - `SYNC_TOKEN`을 긴 비밀키로 바꾸기
   - Drive 폴더 ID를 쓰고 싶으면 `FOLDER_ID`에 폴더 ID 입력

4. Apps Script를 웹앱으로 배포합니다.
   - Deploy > New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone with the link
   - 배포 URL을 복사합니다.

5. 가계부 앱의 설정 > 동기화 설정에 입력합니다.
   - Apps Script URL: 위에서 복사한 웹앱 URL
   - 비밀키: `SYNC_TOKEN`에 넣은 값
   - 설정 저장
   - 처음 한 번은 `올리기`
   - 다른 휴대폰에서는 같은 URL/비밀키 입력 후 `불러오기`

## 사용 팁

- 설정 저장 후 `저장할 때 자동 올리기`를 켜두면 입력/수정할 때 공유 데이터로 자동 업로드됩니다.
- 두 사람이 동시에 오래 오프라인으로 입력하면 마지막으로 올린 데이터가 기준이 될 수 있습니다.
- 이상해졌을 때는 설정 > 데이터 관리에서 JSON 내보내기로 백업을 하나 받아두면 복구가 쉽습니다.
