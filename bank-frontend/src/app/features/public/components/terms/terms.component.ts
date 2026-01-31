import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './terms.component.html',
    styleUrl: './terms.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermsComponent {
    protected readonly lastUpdated = 'January 30, 2024';
}
