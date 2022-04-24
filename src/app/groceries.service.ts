import { Injectable } from '@angular/core';
//import lib for server communication
import { HttpClient } from '@angular/common/http';
//observable lib
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {
  //list of items, which is interpolated
  items: any = [];

  //observable being called
  dataChanged$: Observable<boolean>;
  //subject being called
  private dataChangedSubject: Subject<boolean>;

  //URL being used for ionic app
  //changed to fix with heroku.com
  baseURL = "https://dashboard.heroku.com/apps/groceries-server-demo-morgan";

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesService Provider');

    this.dataChangedSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangedSubject.asObservable();
  }

  //get item function
  getItems(): Observable<any> {
    console.log('within service file...');
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );

  }

  //extractData function
  private extractData(res: Response) {
    console.log('extract data');
    let body = res;
    return body || {};
  }

  //handleError function
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log('handle error function')
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  //removeItem function
  removeItem(id) {
    console.log('#### Remove Item - id = ', id);
    this.http.delete(this.baseURL + '/api/groceries/' + id).subscribe(res => {
      this.items = res;
      this.dataChangedSubject.next(true);
    });
  }
  //add item function
  addItem(item) {
    console.log("item added to database")
    this.http.post(this.baseURL + '/api/groceries', item).subscribe(res => {
      this.items = res;
      this.dataChangedSubject.next(true);
    });
  }
  //edit item function
  editItem(item, index) {
    console.log('editing item = ', item);
    this.http.put(this.baseURL + '/api/groceries/' + item._id, item).subscribe(res => {
      this.items = res;
      this.dataChangedSubject.next(true);
    });
  }
}
