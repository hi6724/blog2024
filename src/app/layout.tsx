import type { Metadata } from 'next';
import './globals.css';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';

import { Roboto, Noto_Sans_KR, Oranienbaum, IBM_Plex_Sans_KR } from 'next/font/google'; // Roboto와 한글 NotoSans를 사용합니다.

import { ThemeProvider } from 'next-themes';
import { ReactQueryClientProvider } from '@/components/common/ReactQueryClientProvider';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

const notoSansKr = Noto_Sans_KR({
  preload: false,
  weight: ['100', '400', '700', '900'], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
  variable: '--sans',
});
const oranienbaum = Oranienbaum({
  subsets: ['latin'],
  weight: '400',
  variable: '--oranienbaum',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
  variable: '--roboto',
});
const ibmSans = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--ibm-sans',
});

export const metadata: Metadata = {
  title: '훈모구 소개',
  description: '싸피와 티맥스핀테크를 거쳐 현재 KB국민은행에서 개발자로 근무하고 있는 프론트엔드 개발자 입니다.',
  keywords: ['포트폴리오', '소개', '개발자', '프론트엔드', '국민은행', '싸피', '핀테크'],
  icons: [{ rel: 'icon', url: '/favi.png' }],
  openGraph: {
    title: '훈모구 소개',
    description: '훈모구의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
    url: 'https://hunmogu.com/about-me', // 실제 URL로 교체
    type: 'website',
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/hunmok-fe31e.appspot.com/o/preview%2Faboutme-preview.webp?alt=media&token=7cc50760-b91e-4fba-b1f4-34e4e6690a31',
        width: 2000,
        height: 797,
        alt: '귀여운 코딩하는 강아지 사진',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
      <html lang='ko' className='scrollbar-hide sm:scrollbar-default' suppressHydrationWarning>
        <body className={`${[notoSansKr.variable, roboto.variable, oranienbaum.variable, ibmSans.variable].join(' ')} font-sans`}>
          <ThemeProvider storageKey='hunmok-theme' defaultTheme='system' value={{ light: 'emerald', dark: 'dracula' }}>
            <Container>
              <NavBar />
              <div className='min-h-96'>{children}</div>
              <Footer />
            </Container>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}

function Container({ children }: any) {
  return (
    <div className='flex justify-center w-full bg-base-200'>
      <div className='max-w-5xl w-full bg-base-100 shadow-xl min-h-screen'>{children}</div>
    </div>
  );
}
