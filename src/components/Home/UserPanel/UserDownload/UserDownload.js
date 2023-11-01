import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
import firebase from 'firebase/compat/app';

const styles = StyleSheet.create({
  // Your existing styles here...
});

const UserDownload = () => {
  const { id } = useParams(); // Get the 'id' parameter from the URL

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const userRef = firebase.firestore().collection('userPayment').doc(id);
    userRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        
        // Convert date and seconds to a specific format
        const nextBillingDate = new Date(userData.nextBillingDate.seconds * 1000);
        const formattedNextBillingDate = `${nextBillingDate.getFullYear()}-${(nextBillingDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${nextBillingDate.getDate().toString().padStart(2, '0')}`;

        userData.nextBillingDate = formattedNextBillingDate;

        setUsers([userData]);
      } else {
        console.log('No such document!');
      }
    });
  }, [id]);

  const MyDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>User Details</Text>
        </View>
        <View style={styles.section}>
          {users.map((user, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Name:</Text>
                <Text>{user.Name}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>DormName:</Text>
                <Text>{user.DormName}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>NextBilling:</Text>
                <Text>{user.nextBillingDate}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Price:</Text>
                <Text>{user.Price}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Month:</Text>
                <Text>{user.CurrentDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <div>
      <PDFDownloadLink document={MyDocument} fileName="user_details.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download PDF'
        }
      </PDFDownloadLink>
    </div>
  );
};

export default UserDownload;
