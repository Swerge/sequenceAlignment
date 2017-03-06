import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  seq1 = 'AATGC';
  seq2 = 'AGGC';
  align_type = [
    {name: 'Global alignment', code: 'global'},
    {name: 'Local alignment', code: 'local'}
  ];
  match: number = 3;
  mismatch: number = -3;
  gap: number = -4;
  selectedType: string = null;
  scoreTab: any;
  concatScoreTab = [];
  result = [];

  displayTab():void {
    for (let i = 0; i < this.seq2.length + 2; i++) {
      for (let j = 0; j < this.seq1.length + 2; j++) {
        this.concatScoreTab.push(this.scoreTab[i][j]);
      }
    }
  }

  displayResult(): void {
    let i = this.seq1.length+1;
    let j = this.seq2.length+1;
    while (i >= 1 && j >=1) {
      if (this.scoreTab[j][i].where == 'diag') {
        console.log('Entry -> I:',i,'J:',j);
        if (this.seq1.charAt(i-2) == this.seq2.charAt(j-2)) {
          this.result.push({comparison: 'match', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
          console.log(this.scoreTab[j][i].where);
        }
        if (this.seq1.charAt(i-2) != this.seq2.charAt(j-2)) {
          this.result.push({comparison: 'mismatch', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
          console.log(this.scoreTab[j][i].where);
        }
        i -= 1;
        j -= 1;
      }
      if (this.scoreTab[j][i] == 'left') {
        console.log('Entry -> I:',i,'J:',j);
        this.result.push({comparison: 'left', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
        console.log(this.scoreTab[j][i].where);
        i -= 1;
      }
      if (this.scoreTab[j][i] == 'up') {
        console.log('Entry -> I:',i,'J:',j);
        this.result.push({comparison: 'up', seq1: this.seq1.charAt(i-2), seq2: this.seq2.charAt(j-2)});
        console.log(this.scoreTab[j][i].where);
        j -= 1;
      }
      console.log('Exit -> I:',i,'J:',j);
    }
    // console.log(this.result);
  }

  initTab(): void {
    this.scoreTab = new Array(this.seq1.length+2);
    for (let i = 0; i < this.seq2.length+2; i++)
      this.scoreTab[i] = new Array(this.seq1.length+2);
    this.scoreTab[0][0] = {value: 'x', where:'init'};
    this.scoreTab[0][1] = {value: '-', where:'init'};
    this.scoreTab[1][0] = {value: '-', where:'init'};
    this.scoreTab[1][1] = {value: 0, where: 'diag'};
    for (let i = 0, j=2; i < this.seq1.length; i++, j++) {
      this.scoreTab[0][i+2] = {value: this.seq1.charAt(i), where:'init'};
      this.scoreTab[1][i+2] = {value: this.scoreTab[1][j-1].value + this.gap, where: 'left'};
    }
    for (let i = 0, j=2; i < this.seq2.length; i++, j++) {
      this.scoreTab[i+2][0] = {value: this.seq2.charAt(i), where:'init'};
      this.scoreTab[i+2][1] = {value: this.scoreTab[j-1][1].value + this.gap, where: 'up'};
    }
  }

  globalAlignment(): void {
    this.initTab();
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
    // this.displayResult();
  }

  localAlignement(): void {

  }

  compare(type): void {
    this.concatScoreTab = [];
    if (this.seq1.length && this.seq2.length) {
      if (type === 'global')
        this.globalAlignment();
      if (type === 'local')
        this.localAlignement()
    }
  }
}
