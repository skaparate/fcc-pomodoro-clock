import { Component, OnInit } from '@angular/core';
import {
  faPlay,
  faPause,
  faPlus,
  faMinus,
  faRedoAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.sass'],
})
export class ClockComponent implements OnInit {
  private sessionLength: number;
  private breakLength: number;
  private minutes: number;
  private seconds: number;
  private isRunnning: boolean;
  private isSession: boolean;
  private faPlay = faPlay;
  private faPause = faPause;
  private faPlus = faPlus;
  private faMinus = faMinus;
  private faRedoAlt = faRedoAlt;
  private intervalHandle: number;
  private audio: HTMLAudioElement;
  private isClear: boolean;
  private displayClasses: string = '';

  constructor() {}

  reset() {
    this.seconds = 0;
    this.minutes = 25;
    this.sessionLength = 25;
    this.breakLength = 5;
    this.isRunnning = false;
    this.isSession = true;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isClear = true;
    this.displayClasses = '';
    if (this.intervalHandle) {
      window.clearInterval(this.intervalHandle);
    }
  }

  ngOnInit() {
    this.audio = document.querySelector('#beep');
    this.reset();
  }

  updateMinutes(value: number) {
    if (this.isClear) {
      this.minutes = value;
    }
  }

  onBreakIncrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.breakLength < 60) {
      this.breakLength = this.breakLength + 1;
      this.updateMinutes(this.breakLength);
    }
  }

  onBreakDecrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.breakLength > 1) {
      this.breakLength = this.breakLength - 1;
      this.updateMinutes(this.breakLength);
    }
  }

  onSessionIncrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.sessionLength < 60) {
      this.sessionLength = this.sessionLength + 1;
      this.updateMinutes(this.sessionLength);
    }
  }

  onSessionDecrease() {
    if (this.isRunnning) {
      return;
    }
    if (this.sessionLength > 1) {
      this.sessionLength = this.sessionLength - 1;
      this.updateMinutes(this.sessionLength);
    }
  }

  onStartClick() {
    this.isRunnning = !this.isRunnning;
    this.isClear = false;
    if (this.isRunnning) {
      console.debug('Starting');
      this.intervalHandle = window.setInterval(this.nextTick.bind(this), 1000);
    } else {
      console.debug('Pausing');
      window.clearInterval(this.intervalHandle);
    }
  }

  onReset() {
    this.reset();
  }

  playSound() {
    this.audio.currentTime = 0;
    this.audio.play();
  }

  stopSound() {
    this.audio.pause();
  }

  nextTick() {
    this.seconds = this.seconds - 1;
    if (this.minutes > 0 && this.seconds <= 0) {
      this.seconds = 59;
      this.minutes = this.minutes - 1;
    }

    if (this.minutes <= 1) {
      this.displayClasses = 'text-danger';
    }

    if (this.minutes === 0 && this.seconds === 0) {
      console.debug('--- Finished ---');
      window.clearInterval(this.intervalHandle);
      this.playSound();

      const tmpHandle = window.setInterval(() => {
        this.isSession = !this.isSession;
        if (!this.isSession) {
          this.minutes = this.breakLength;
        } else {
          this.minutes = this.sessionLength;
        }
        this.intervalHandle = window.setInterval(
          this.nextTick.bind(this),
          1000
        );
        window.clearInterval(tmpHandle);
      }, 1000);
    }
  }

  private formatValue(value: number) {
    return value.toString().padStart(2, '0');
  }

  get display() {
    return `${this.formatValue(this.minutes)}:${this.formatValue(
      this.seconds
    )}`;
  }
}
