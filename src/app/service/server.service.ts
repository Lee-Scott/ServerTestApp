import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,Subscriber,throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';


@Injectable({
  providedIn: 'root'
})
export class ServerService {
  
  private readonly apiUrl = 'http://localhost:8080';

  // Dependency injection
  constructor(private http: HttpClient) { }

  /* non reactive way
  getServers(): Observable<CustomResponse>{
    return this.http.get<CustomResponse>(`http:/localhost:8080/server/list`);
  }
  */

  // observable as noted with $
  server$ =  <Observable <never>>
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ =  (server: Server) => <Observable <never>>
  this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ =  (ipAdress: string) => <Observable <never>>
  this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAdress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ =  (status: Status, response: CustomResponse) => <Observable <never>> // filter all the servers by a specific status
  new Observable<CustomResponse>( // create a observable 
    subscriber => { // call back function takes a subscriber
      console.log(response);
      subscriber.next(
          status === Status.ALL ? {...response, message: `Servers filtered by ${status} status`} :  // case of status == all
          { // case status != all
            ...response,
            message: response.data.servers  // override message 
            .filter(server => server.status === status).length > 0 ? // filter the servers if length 
            `Servers filtered by ${status === Status.SERVER_UP ? 'SEVER UP' : 'SERVER DOWN'} status` : // set message to up or down
            `No server of ${status} found`, // case of no up or down server 
            data: { servers: response.data.servers // filter the date and return to the user
              .filter(server => server.status === status)}
          }
      );
      subscriber.complete(); // sub and smash that like button
    }
  )
  .pipe( // can call on above becurse it returns an observable
    tap(console.log),
    catchError(this.handleError) // catch error
  );

  delete$ =  (serverId: number) => <Observable <never>>
  this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  // for debug
  // TODO make more robust
  private handleError(error: HttpErrorResponse): Observable <never> {
    console.log(error)
    console.log(error)
    return throwError ('An error occurred - Error code: ${error.status}');
  }
}
