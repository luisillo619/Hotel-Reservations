import React from 'react';
import styles from "./landing.module.scss"
import { Layout } from '@/components/Layout';


export default function Landing () {
  return (
    <Layout>
      <h1 className={styles.pepe}>Landing</h1>
    </Layout>
  );
};