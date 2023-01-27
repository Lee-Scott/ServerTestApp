import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/server';
import { NotificationService } from './service/notification.service';

import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();



  constructor(private serverService: ServerService, private notifier: NotificationService){} // injection 

  // like a runnable in java, runs on startup
  ngOnInit(): void {
    this.appState$ = this.serverService.server$ // subscribe this observable that makes a http request 
    .pipe(
      map(response => { // callback when ever there is a response from the server
        this.notifier.onDefault(response['message']); // sends a notification the the bottom left 
        this.dataSubject.next(response) // save the response in the dataSubject for pingServer()
        return { dataState: DataState.LOADED_STATE, appData: response}
      }),
      startWith({dataState: DataState.LOADING_STATE}), // waiting for data so we omit response
      catchError((error: string) => {
        this.notifier.onError(error); // sends a notification the the bottom left 
        return of ({dataState: DataState.ERROR_STATE, error }) // if we catch an error
      })
    );
  }

  pingServer(ipAddress: string): void {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.serverService.ping$(ipAddress)
      .pipe(
        map(response => {
          const index = this.dataSubject.value.data.servers.findIndex(server =>  server.id === response['data.server.id']);
          this.dataSubject.value.data.servers[index] = response['data.server'];
          this.filterSubject.next('');
          this.notifier.onDefault(response['message']);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.filterSubject.next('');
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  // Not getting any new data from the backend because we already have it in response

  filterServers(status: Status): void {
    
    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          this.notifier.onDefault(response['message']);
          return { dataState: DataState.LOADED_STATE, appData: response }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  saveServer(serverForm: NgForm): void {
    this.isLoading.next(true);
    this.appState$ = this.serverService.save$(<Server> serverForm.value)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response as CustomResponse, data: { servers: [response["data.server"], ...response["this.dataSubject.value.server"] ]} }
          );
          this.notifier.onDefault(response['message']);
          document.getElementById('closeModal').click(); // closes the modal
          this.isLoading.next(false);
          serverForm.resetForm( { status: this.Status.SERVER_DOWN }) // have server down as a default
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {  
          this.isLoading.next(true);
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }
  
  deleteServer(server: Server): void {
    this.appState$ = this.serverService.delete$(server.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response as CustomResponse, data: { servers: this.dataSubject.value.data.servers.filter(serverS => serverS.id !== server.id)}}
          );
          this.notifier.onDefault(response['message']);
          return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.notifier.onError(error);
          return of({ dataState: DataState.ERROR_STATE, error });
        })
      );
  }

  printReport(): void {
    this.notifier.onDefault('Report Downloaded');
    window.print();

    // TODO ADD OPTION Make dropdown

    /* print for excel
    let dataType = 'application/vnd.ms-excel.sheet.marcoEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20')// replaces spaces with value of space...
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink); // put link in as a child 
    downloadLink.href = 'data:' + dataType + ", " + tableHtml;
    downloadLink.download = 'server-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink); // takes the link out
    */

  }


}
