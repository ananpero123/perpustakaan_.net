import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    userUid: string | null = null;
    firstName: string = '';
    lastName: string = '';
    username: string = '';
    email: string = '';
    address: string = '';
    phone: string = '';
    imageProfile: string | undefined;
    isUploading: boolean = false;
    isSaving: boolean = false;


    constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) {}

    ngOnInit() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.userUid = user.uid;
                const firestoreInstance = getFirestore();
                const userDocRef = doc(firestoreInstance, 'users', this.userUid);

                getDoc(userDocRef).then((userDoc) => {
                    if (userDoc.exists()) {
                        const userData = userDoc.data() as any;
                        this.firstName = userData.firstName;
                        this.lastName = userData.lastName;
                        this.username = userData.username;
                        this.email = userData.email;
                        this.address = userData.address;
                        this.phone = userData.phone;
                        this.imageProfile = userData.imageProfile;
                    }
                });
            }
        });
    }

    handleImageUpload(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.isUploading = true; // Set isUploading menjadi true saat proses pengunggahan dimulai

            const userUid = this.userUid;
            const email = this.email;
            if (!userUid || !email) {
                return;
            }

            const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, '_');

            const filePath = `profilphoto/${sanitizedEmail}/${new Date().getTime()}_${file.name}`;
            const fileRef = this.storage.ref(filePath);

            this.storage.upload(filePath, file).then(() => {
                fileRef.getDownloadURL().subscribe((downloadURL) => {
                    this.imageProfile = downloadURL;
                    this.isUploading = false; // Set isUploading menjadi false setelah selesai
                });
            });
        }
    }

    saveChanges() {
        this.isSaving = true; // Set isSaving menjadi true saat proses penyimpanan dimulai
    
        if (this.userUid) {
            const firestoreInstance = getFirestore();
            const userDocRef = doc(firestoreInstance, 'users', this.userUid);
    
            const updatedData = {
                firstName: this.firstName,
                lastName: this.lastName,
                username: this.username,
                email: this.email,
                address: this.address,
                phone: this.phone,
                imageProfile: this.imageProfile
            };
    
            updateDoc(userDocRef, updatedData)
                .then(() => {
                    console.log('Data updated successfully');
                    this.isSaving = false; // Set isSaving menjadi false setelah penyimpanan selesai
                    this.refreshPage();
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    this.isSaving = false; // Pastikan isSaving diset kembali menjadi false jika terjadi kesalahan
                });
        }
    }
    
    

    refreshPage() {
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
}
