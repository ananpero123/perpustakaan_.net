import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  pdfId: string | null = null;

  constructor(private route: ActivatedRoute, private renderer: Renderer2) {}

  ngOnInit() {
    this.pdfId = this.route.snapshot.paramMap.get('id');

    if (this.pdfId) {
      const iframe = document.getElementById('pdfFrame') as HTMLIFrameElement;
      const pdfUrl = `${this.pdfId}`;
      this.renderer.setAttribute(iframe, 'src', pdfUrl);
    }
  }
}