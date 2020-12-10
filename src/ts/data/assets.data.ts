export default class AssetsData {
  private importAll = (require: any): any =>
    require.keys().reduce((acc: any, next: any) => {
      // eslint-disable-next-line import/no-dynamic-require
      acc[next.replace('./', '')] = require(next);
      return acc;
    }, {});

  public importImages = (): any => {
    return {
      key: this.importAll(require.context('./', false, /\.(png|jpe?g|svg|gif)$/)),
    };
  };
}
