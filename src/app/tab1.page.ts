import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
//library for toast from ionic
import { ToastController } from '@ionic/angular';
//library for alerts through ionic
import { AlertController } from '@ionic/angular';
//library for dependency injections
import { GroceriesService } from '../groceries.service';
import { InputDialogService } from '../input-dialog.service';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  //Interpolation that can change the title of the header
  title = "Grocery"

  items = [];
  errorMessage: string;

  //calls upon navCtrl, toastCtrl, alertCtrl, socialSharing and calls upon generated service files
  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertController: AlertController, public dataService: GroceriesService, public InputDialogService: InputDialogService, private socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }
  //load items from service file
  loadItems() {
    console.log("accessing loadItems()...");
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
  }
  //toast function that removes an item. Displays that item is removed
  async removeItem(id) {
    this.dataService.removeItem(id);
  }
  async shareItem(item, index) {
    console.log("Sharing Item - ", item, index);
    const toast = await this.toastCtrl.create({
      message: "Sharing Item - " + index + " ...",
      duration: 3000
    });
    toast.present();
    //splices the array to show an item being removed
    // Check if sharing via email is supported
    let message = 'Grocery Item - Name: ' + item.name + ' - Quantity: ' + item.quantity;
    let subject = 'Shared via Groceries App';
    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log('Shared successful');
    }).catch((error) => {
      // Sharing via email is not possible
      console.error('Error while sharing ', error);
    });
  }
  //toast function that edits an item
  async editItem(item, index) {
    //logs into the console
    console.log("Editing Item - ", item, index);
    const toast = await this.toastCtrl.create({
      message: "Editing Item - " + index + " ...",
      duration: 3000
    });
    toast.present();
    //calls upon presentEditAlert function
    this.InputDialogService.showPrompt(item, index);
    
  }
  //add functionaility for tab1 page.html
  async addItem() {
    console.log("adding item");
    this.InputDialogService.showPrompt();

  }
  

}
