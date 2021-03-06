import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'asVideoFilter'
})

export class VideoFilterPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {

    }

    appendAutoPlay(url): string {

        let xUrl = url;

        if (xUrl.indexOf('?') !== -1) {

            xUrl = xUrl + '&';

        } else {

            xUrl = xUrl + '?';

        }

        xUrl = xUrl + 'autoplay=1';

        return xUrl;
    }

    transform(url) {
        let lowerUrl = url.toLowerCase();
        let xUrl = url;

        if (lowerUrl.indexOf('youtube') !== -1) {

            if (xUrl.indexOf('watch?v=') !== -1) {

                xUrl = xUrl.replace('watch?v=', 'embed/');

            } else if (xUrl.indexOf('%2Fwatch%3Fv%3D')) {

                let allFound = /%2Fwatch%3Fv%3D(.+)%26/i.exec(xUrl);
                let found = allFound[1];
                xUrl = 'https://youtube.com/embed/' + found;

            }
        } else if (xUrl.indexOf('youtu.be') !== -1) {

            let urlParts = xUrl.split('/');
            let videoId = urlParts[urlParts.length - 1];
            xUrl = 'https://youtube.com/embed/' + videoId;

        } else if (lowerUrl.indexOf('youtu.be') !== -1) {

            let urlParts = xUrl.split('/');
            xUrl = 'https://youtube.com/embed/' + urlParts[urlParts.length - 1] + '?autoplay=1';

        } else if (lowerUrl.indexOf('streamable') !== -1) {

            let urlParts = xUrl.split('/');
            urlParts.splice(urlParts.length - 1, 0, 'e');
            xUrl = urlParts.join('/');

        } else if (lowerUrl.indexOf('vimeo.com') !== -1) {

            let urlParts = xUrl.split('/');
            let videoId = urlParts[urlParts.length - 1];
            xUrl = 'https://player.vimeo.com/video/' + videoId;

        } else if (lowerUrl.indexOf('vid.me')) {

            let urlParts = xUrl.split('/');
            let videoId = urlParts[urlParts.length - 1];
            xUrl = 'https://vid.me/e/' + videoId;

        }

        xUrl = this.appendAutoPlay(xUrl);

        return this.sanitizer.bypassSecurityTrustResourceUrl(xUrl);
    }
}
