import { GlobalAlignmentPage } from './app.po';

describe('global-alignment App', function() {
  let page: GlobalAlignmentPage;

  beforeEach(() => {
    page = new GlobalAlignmentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
