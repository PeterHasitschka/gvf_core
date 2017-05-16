import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

@Pipe({ name: 'keepHtml', pure: true })
export class EscapeHtmlPipe implements PipeTransform {

    constructor(private sanitizer: DomSanitizationService) {
    }

    transform(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}