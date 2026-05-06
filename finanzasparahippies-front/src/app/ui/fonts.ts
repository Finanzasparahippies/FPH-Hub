import { Inter, Montserrat, Caveat, Bubblegum_Sans } from 'next/font/google';

export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
    weight: '400',
    style: ['normal', 'italic'],
});

export const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat',
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

export const bubblegum = Bubblegum_Sans({
    subsets: ['latin'],
    variable: '--font-bubblegum',
    display: 'swap',
    weight: '400',
});