import { Component, Input } from '@angular/core';

export type SquareValue = 'X' | 'O';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value: SquareValue;
}
