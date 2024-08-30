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
  title: '하훈목 소개',
  description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
  keywords: ['하훈목', '포트폴리오', '소개', '개발자', '프론트엔드'],
  icons: {
    icon: '/favi.png', // /public path
  },
  openGraph: {
    title: '하훈목 소개',
    description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
    url: 'https://hunmok-blog-2024.vercel.app/about-me', // 실제 URL로 교체
    type: 'website',
    images: [
      {
        url: 'https://hunmok-blog-2024.vercel.app/profile-image.jpg', // 프로필 이미지나 관련 이미지의 실제 URL로 교체
        width: 800,
        height: 600,
        alt: '하훈목의 프로필 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '하훈목 소개',
    description: '하훈목의 포트폴리오 사이트에서 자신에 대해 소개하는 페이지입니다.',
    images: ['https://hunmok-blog-2024.vercel.app/profile-image.jpg'], // 실제 이미지 URL로 교체
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
        <head>
          <link rel='icon' href='/favi.png' />
        </head>
        <body
          className={`${[notoSansKr.variable, roboto.variable, oranienbaum.variable, ibmSans.variable].join(
            ' '
          )} font-sans`}
        >
          <ThemeProvider
            storageKey='hunmok-theme'
            defaultTheme='darken'
            value={{ lighten: 'emerald', light: 'garden', dark: 'dim', darken: 'night' }}
          >
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
      <div className='max-w-5xl w-full bg-base-100 shadow-lg min-h-screen'>{children}</div>
    </div>
  );
}
