import { Injectable } from '@angular/core';
import {API, graphqlOperation} from "aws-amplify";
import * as Observable from "zen-observable";

import {Comment} from "./comment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor() { }

  async list(): Promise<Comment[]> {
    const statement = `query allComments {
      allComments {
        items {
          id
          content
        }
      }
    }`;

    const response = (await API.graphql(
      graphqlOperation(statement)
    )) as any;
    return response.data.allComments.items;
  }

  async createComment(
    content: string
  ): Promise<Comment> {
    const statement = `mutation saveComment($content: String!) {
      saveComment(content: $content) {
        id
        content
      }
    }`;
    const gqlAPIServiceArguments: any = {
      "content": content
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <any>response.data;
  }

  subscribeSaveComment(): Observable<Comment> {
    const statement = `subscription onSaveComment {
        onSaveComment {
          id,
          content
        }
      }`;

    return ((API.graphql(graphqlOperation(statement))) as Observable<any>)
      .map(data => data.value.data.onSaveComment);
  }
}
