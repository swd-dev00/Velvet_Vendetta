import Phaser from 'phaser';
import { gameConfig } from './game/config';
import { AppUi } from './ui/AppUi';
import './style.css';

new Phaser.Game(gameConfig);
new AppUi().mount();
