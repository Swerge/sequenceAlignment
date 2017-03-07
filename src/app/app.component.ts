import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  seq1 = 'CAATTGA';
  seq2 = 'GAATCTGC';
  align_type = [
    {name: 'Global alignment', code: 'global'},
    {name: 'Local alignment', code: 'local'}
  ];
  match: number;
  mismatch: number;
  gap: number;
  selectedType: string = null;
  scoreTab: any;
  concatScoreTab: any;
  result: any;

  displayTab():void {
    for (let i = 0; i < this.seq2.length + 2; i++) {
      for (let j = 0; j < this.seq1.length + 2; j++) {
        this.concatScoreTab.push(this.scoreTab[i][j]);
      }
    }
  }

  resGlobal(): void {
    let i = this.seq1.length+1;
    let j = this.seq2.length+1;
    while (i >= 1 && j >= 1) {
      if (this.scoreTab[j][i].where == 'diag') {
        if (this.seq1.charAt(i-2) == this.seq2.charAt(j-2)) {
          this.result.push({comparison: 'match', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
        }
        if (this.seq1.charAt(i-2) != this.seq2.charAt(j-2)) {
          this.result.push({comparison: 'mismatch', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
        }
        i -= 1;
        j -= 1;
      }
      else if (this.scoreTab[j][i].where == 'left') {
        this.result.push({comparison: 'left', seq1: this.seq1.charAt(i-2), seq2: '-'});
        i -= 1;
      }
      else if (this.scoreTab[j][i].where == 'up') {
        this.result.push({comparison: 'up', seq1: '-', seq2: this.seq2.charAt(j-2)});
        j -= 1;
      }
    }
    this.result.reverse().shift();
  }

  resLocal(): void {
    let tmp = 0;
    let startI;
    let startJ;

    for (let i = 0; i < this.seq2.length + 2; i++) {
      for (let j = 0; j < this.seq1.length + 2; j++) {
        if (this.scoreTab[i][j].value > tmp) {
          tmp = this.scoreTab[i][j].value;
          startI = i;
          startJ = j;
        }
      }
    }
    while (this.scoreTab[startI][startJ].value > 0) {
      if (this.scoreTab[startI][startJ].where == 'diag') {
        if (this.scoreTab[startI][0].value == this.scoreTab[0][startJ].value) {
          this.result.push({comparison: 'match', seq1: this.scoreTab[startI][0].value, seq2: this.scoreTab[0][startJ].value});
        }
        if (this.scoreTab[startI][0].value != this.scoreTab[0][startJ].value) {
          this.result.push({comparison: 'mismatch', seq1: this.scoreTab[startI][0].value, seq2: this.scoreTab[0][startJ].value});
        }
        startI -= 1;
        startJ -= 1;
      }
      else if (this.scoreTab[startI][startJ].where == 'left') {
        this.result.push({comparison: 'left', seq1: this.scoreTab[startI][0].value, seq2: '-'});
        startJ -= 1;
      }
      else if (this.scoreTab[startI][startJ].where == 'up') {
        this.result.push({comparison: 'left', seq1: '-', seq2: this.scoreTab[0][startJ].value});
        startI -= 1;
      }
    }
    this.result.push({comparison: this.scoreTab[startI][startJ].where, seq1: this.scoreTab[startI][0].value, seq2: this.scoreTab[0][startJ].value});
    this.result.reverse().shift();
  }

  initTab(alignType:string): void {
    this.scoreTab = new Array(this.seq1.length+2);
    for (let i = 0; i < this.seq2.length+2; i++)
      this.scoreTab[i] = new Array(this.seq1.length+2);
    this.scoreTab[0][0] = {value: 'x', where:'init'};
    this.scoreTab[0][1] = {value: '-', where:'init'};
    this.scoreTab[1][0] = {value: '-', where:'init'};
    this.scoreTab[1][1] = {value: 0, where: 'diag'};
    for (let i = 0, j=2; i < this.seq1.length; i++, j++) {
      this.scoreTab[0][i+2] = {value: this.seq1.charAt(i), where:'init'};
      if (alignType == 'global')
        this.scoreTab[1][i+2] = {value: this.scoreTab[1][j-1].value + this.gap, where: 'left'};
      if (alignType == 'local')
        this.scoreTab[1][i+2] = {value: 0, where: 'left'};
    }
    for (let i = 0, j=2; i < this.seq2.length; i++, j++) {
      this.scoreTab[i+2][0] = {value: this.seq2.charAt(i), where:'init'};
      if (alignType == 'global')
        this.scoreTab[i+2][1] = {value: this.scoreTab[j-1][1].value + this.gap, where: 'up'};
      if (alignType == 'local')
        this.scoreTab[i+2][1] = {value: 0, where: 'up'};
    }
  }

  globalAlignment(): void {
    this.initTab('global');
    for (let j = 2; j <= this.seq2.length + 1; j++) {
      for (let i = 2; i <= this.seq1.length + 1; i++ ) {
        let diag = this.scoreTab[j-1][i-1].value + (this.seq1.charAt(i-2) == this.seq2.charAt(j-2) ? this.match : this.mismatch);
        let left = this.scoreTab[j][i-1].value + this.gap;
        let up = this.scoreTab[j-1][i].value + this.gap;
        let tmp = Math.max(diag, left, up);
        if (tmp == diag)
          this.scoreTab[j][i] = {value: tmp, where: 'diag'};
        else if (tmp == left)
          this.scoreTab[j][i] = {value: tmp, where: 'left'};
        else if (tmp == up)
          this.scoreTab[j][i] = {value: tmp, where: 'up'};
        }
      }
    this.displayTab();
    this.resGlobal();
  }

  localAlignement(): void {
    this.initTab('local');
    for (let j = 2; j <= this.seq2.length + 1; j++) {
      for (let i = 2; i <= this.seq1.length + 1; i++ ) {
        let diag = this.scoreTab[j-1][i-1].value + (this.seq1.charAt(i-2) == this.seq2.charAt(j-2) ? this.match : this.mismatch);
        let left = this.scoreTab[j][i-1].value + this.gap;
        let up = this.scoreTab[j-1][i].value + this.gap;
        if (diag < 0){diag = 0};
        if (left < 0){left = 0};
        if (up < 0){up = 0};
        let tmp = Math.max(diag, left, up);
        if (tmp == diag)
          this.scoreTab[j][i] = {value: tmp, where: 'diag'};
        else if (tmp == left)
          this.scoreTab[j][i] = {value: tmp, where: 'left'};
        else if (tmp == up)
          this.scoreTab[j][i] = {value: tmp, where: 'up'};
      }
    }
    this.displayTab();
    this.resLocal();
  }

  resetArrays(): void {
    this.concatScoreTab = null;
    this.result = null;
    this.seq1 = '';
    this.seq2 = '';
    this.match = null;
    this.mismatch = null;
    this.gap = null;
    this.selectedType = null;
  }

  compare(type): void {
    this.concatScoreTab = [];
    this.result = [];
    if (this.seq1.length && this.seq2.length) {
      if (type === 'global')
        this.globalAlignment();
      if (type === 'local')
        this.localAlignement()
    }
  }
}
