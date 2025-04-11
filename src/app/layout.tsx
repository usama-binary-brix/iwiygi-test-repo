"use client";  // Client-side component

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';  
import { Inter } from "next/font/google";
import './globals.css';
import 'react-image-lightbox/style.css'; 
import PageLayout from "@/components/PageLayout/page";  
import Loader from '@/components/Loader';  
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}> 
          <PersistGate loading={<Loader />} persistor={persistor}>  
            <PageLayout>{children}</PageLayout> 
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
