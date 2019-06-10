import {Component, OnInit} from '@angular/core';
import {CommentService} from "./comment.service";
import {Comment} from "./comment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  comments: Comment[] = [];
  newComment: string = null;

  showSpinner = true;

  constructor(private commentService: CommentService) {
  }

  ngOnInit(): void {
    this.commentService.list().then(data => {
      this.comments = data;
      this.showSpinner = false;
    });

    this.commentService.subscribeSaveComment().subscribe(data => {
      this.comments = [...this.comments, data];
    });
  }

  sendComment() {
    if (this.newComment) {
      this.commentService.createComment(this.newComment)
        .then(data => this.newComment = null);
    }
  }
}
