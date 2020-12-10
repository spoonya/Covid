import '../styles/style.scss';
import HeaderComponent from './components/header.component';
import CategoryComponent from './components/category.component';
import PlayBtnComponent from './components/play-btn.component';
import PlayMode from './play-mode';

export const header: HeaderComponent = new HeaderComponent();
export const categories: CategoryComponent = new CategoryComponent();
export const playMode: PlayMode = new PlayMode();
export const playBtn: PlayBtnComponent = new PlayBtnComponent();

const init = (): void => {
  header.initHeader();
  categories.initCategories();
  playBtn.initPlayBtn();
};

init();
