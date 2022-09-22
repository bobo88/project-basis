declare namespace API {
  interface TypeTest {
    limit: number;
    [props: string]: any;
  }
}

interface MyType {
  foo: string;
  bar: string[];
}

declare module '*.vue';