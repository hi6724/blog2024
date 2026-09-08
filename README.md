<h1 align="center"> 𝒉𝒖𝒏𝒎𝒐𝒌-𝒃𝒍𝒐𝒈 </h1>
<br/>


<br/>


https://hunmogu.com/




## 💜 프로젝트 진행 기간
2022-06-10 ~ 2024-09-04 (1인)

## 🎵 제작배경
개인적으로 노션을 정말 많이 사용하고 있습니다. 

프로젝트를 정리해 두기도 하고, SSAFY를 다니며 배운내용, 알고리즘 스터디 문제풀이 등을 사용합니다. 

이렇게 제가 정리한 글들을 블로그화 시키면 좋겠다고 생각해서, notion API를 사용해서 제작했습니다.

## ✔ 주요 기술
### BE
- Express.js
- Notion API

### FE
- Next.js
- framer-motion

### 배포
vercel 사용해서 배포중입니다.



## 페이지별 Supabase 댓글

블로그와 프로젝트는 공통 `CommentSection`을 사용합니다. Notion 페이지 UUID를
`comment.post_id`로 저장하고 해당 ID의 댓글만 조회합니다. 기존 32자리 ID도 함께
조회하며 새 댓글은 하이픈이 있는 UUID로 저장합니다. 기존 Supabase 댓글은 유지됩니다.
Notion 댓글을 자동 이전하는 작업은 포함되어 있지 않습니다.

- 이름과 비밀번호로 작성자를 서버에서 검증하며 처음 쓰는 이름은 자동 등록합니다.
- 비밀번호는 bcrypt로 해시하여 저장하고 댓글/사용자 응답에서 제외합니다.
- 등록 실패 시 입력을 유지하고, 성공하면 DB에서 반환한 댓글을 즉시 표시합니다.
- 댓글 조회 실패는 Notion 본문 표시에 영향을 주지 않습니다.
- 댓글의 수정·삭제 버튼에서 작성자 비밀번호를 입력해 변경할 수 있습니다.
- 수정/삭제 서버 액션도 이름·비밀번호와 작성자 소유권을 검증합니다.

서버 환경변수:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_OR_SECRET_KEY
```

`SUPABASE_SERVICE_ROLE_KEY`에는 공개용 anon 키가 아닌 실제 service_role/secret 키를
설정해야 합니다. `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다. Vercel 등 배포 환경에도
이 값을 설정하고 새 코드를 배포해야 합니다.

`supabase/migrations/20260907141550_secure_page_comments.sql`은 기존 `public.user`,
`public.comment` 테이블에 RLS와 조회 인덱스를 추가합니다. 사용자 정의 이름/비밀번호
인증을 사용하므로 공개 RLS 정책은 두지 않고 Next.js 서버 액션에서만 접근합니다.
이 SQL은 현재 프로젝트에 SQL Editor로 적용했습니다. 기존 배포 코드에서 anon 키로
직접 접근하는 기능은 새 서버 액션 코드로 배포하기 전까지 차단됩니다.
CLI로 DB를 관리하기 시작할 때는 기존 스키마를 baseline으로 확보하고, 이미 적용한
이 변경을 중복 적용하지 않도록 migration history를 맞춰주세요.

검증:

```sh
node --test tests/comments.test.cjs
npx tsc --noEmit
# 선택: 설정된 DB에 격리된 테스트 데이터를 만들고 테스트 후 삭제합니다.
RUN_SUPABASE_TESTS=1 node --test tests/comments.integration.cjs
```

## Supabase 방명록

기존 Notion 방명록 37건을 `public.guestbook`으로 이전했습니다. 이름, 제목, 본문,
아이콘, 원본 페이지 ID와 작성 시각을 보존했고 Notion 원본은 유지했습니다.
이전된 방명록의 수정·삭제 비밀번호는 모두 `password`이며 bcrypt 해시로 저장합니다.
새 방명록은 작성 시 입력한 비밀번호를 사용합니다. 댓글 사용자 계정과는 별도입니다.

목록·개수·작성·수정·삭제 API와 메인 화면은 Supabase를 사용합니다. 수정 시 작성자
이름은 유지합니다. RLS와 권한 제한으로 브라우저의 직접 DB 접근은 차단하고 서버에서
비밀번호를 검증합니다. 서버용 환경변수는 위 댓글 설정과 같습니다.

`supabase/migrations/20260907142940_migrate_guestbook.sql`은 현재 DB에 적용했습니다.
`node scripts/migrate-guestbook.cjs`로 Notion 전체 페이지를 읽어 이전할 수 있으며,
원본 페이지 ID가 이미 존재하면 덮어쓰지 않습니다. 스크립트는 원본과 이전 결과를
대조하므로 이전 후 수정된 행이 있으면 검증 오류를 보고합니다.
실제 사이트의 방명록 전환에는 이 코드의 배포가 필요합니다.

로컬 개발 서버를 실행한 상태에서 API 통합 검증:

```sh
RUN_SUPABASE_TESTS=1 node --test tests/guestbook.integration.cjs
```

테스트는 임시 방명록의 CRUD, 비밀번호 차단, 이름 보존, 개수, 양방향 페이지 이동을
검증하고 임시 데이터를 삭제합니다.

