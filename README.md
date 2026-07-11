# 반도체 실적 발표 캘린더

삼성전자와 SK하이닉스의 공식 실적발표 일정을 월간 캘린더로 정리한 정적 웹사이트입니다. 모든 날짜는 한국시간(`Asia/Seoul`) 기준이며, 공식적으로 확인된 일정만 표시합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

검증 명령은 다음과 같습니다.

```bash
npm test
npm run build
npm run preview
```

## 일정 데이터 갱신

일정은 `src/data/earnings.ts` 한 곳에서 수동 관리합니다.

1. [삼성전자 IR 일정](https://www.samsung.com/global/ir/ir-events-presentations/events/) 또는 [SK하이닉스 IR 뉴스룸](https://news.skhynix.co.kr/tag/%EC%8B%A4%EC%A0%81%EB%B0%9C%ED%91%9C/)에서 새 일정을 확인합니다.
2. `events` 배열에 고유 ID, 회사, 제목, 대상 분기, ISO 날짜, 일정 유형, 공식 출처를 추가합니다.
3. 시간이 공식 발표된 경우에만 `timeKst`를 `HH:mm` 형식으로 추가합니다.
4. `lastVerifiedAt`을 실제 확인 날짜로 갱신합니다.
5. `npm test`와 `npm run build`를 실행한 뒤 커밋합니다.

예상 일정은 추가하지 않습니다. 미확정 일정은 공식 공지 이후에만 반영합니다.

## GitHub Pages 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 테스트와 빌드를 실행한 뒤 `dist`를 GitHub Pages에 배포합니다. Vite의 기본 경로는 `/stock_announcement_calender/`로 설정되어 있습니다.

저장소의 **Settings → Pages → Build and deployment**에서 Source가 **GitHub Actions**로 설정되어 있어야 합니다.

## 면책 안내

이 프로젝트는 공식 IR 자료를 보기 쉽게 정리한 참고용 서비스이며, 투자 제안이나 종목 추천을 제공하지 않습니다. 일정은 변경될 수 있으므로 투자 판단 전 각 회사의 공식 자료를 다시 확인하세요.
