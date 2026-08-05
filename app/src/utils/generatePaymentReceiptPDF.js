// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import { PermissionsAndroid, Platform, Alert, ToastAndroid, Linking } from 'react-native';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// const Lalogo = require("../assets/Image/Avatars/logo3.png");
// import { Image } from 'react-native';

// // Enhanced permission request function for Android
// const requestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;

//   try {
//     // For Android 13+ (API 33+)
//     if (Platform.Version >= 33) {
//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//       );
//       if (result === PermissionsAndroid.RESULTS.GRANTED) {
//         return true;
//       }
//     }
//     // For Android 12 and below
//     else {
//       const writeResult = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission Required',
//           message: 'This app needs access to your storage to save PDF files',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK'
//         }
//       );

//       const readResult = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission Required',
//           message: 'This app needs access to your storage to read PDF files',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK'
//         }
//       );

//       if (
//         writeResult === PermissionsAndroid.RESULTS.GRANTED &&
//         readResult === PermissionsAndroid.RESULTS.GRANTED
//       ) {
//         return true;
//       }
//     }

//     // If permissions weren't granted, show message and direct to settings
//     Alert.alert(
//       'Permission Required',
//       'Storage permission is required to save PDFs. Please enable it in app settings.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Open Settings', onPress: () => Linking.openSettings() }
//       ]
//     );
//     return false;
//   } catch (err) {
//     console.warn('Permission request error:', err);
//     return false;
//   }
// };

// // Function to convert image to base64
// const getBase64FromImage = async (imagePath) => {
//   try {
//     const base64 = await RNFS.readFile(imagePath, 'base64');
//     return `data:image/png;base64,${base64}`;
//   } catch (error) {
//     console.error('Error converting image to base64:', error);
//     return null;
//   }
// };

// const generatePaymentReceiptPDF = async (feeData, paymentIndex) => {
//   console.log('Fee Data: ', feeData);
//   console.log('Payment Index: ', paymentIndex);

//   try {
//     // First check for permissions
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       if (Platform.OS === 'android') {
//         ToastAndroid.show('Storage permission required to save PDF.', ToastAndroid.LONG);
//       } else {
//         Alert.alert('Permission Required', 'Storage permission is needed to save the PDF.');
//       }
//       return null;
//     }

//     // Check if feeData and required properties exist
//     if (!feeData || !feeData.payments || !feeData.payments[paymentIndex]) {
//       throw new Error('Payment data is required');
//     }

//     const student = feeData.student || {};
//     const payment = feeData.payments[paymentIndex];

//     // Format the payment date
//     const paymentDate = new Date(payment.paymentDate);
//     const formattedDate = paymentDate.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });

//     // Generate invoice number
//     const invoiceNo = `INV-${new Date().getFullYear()}-${String(paymentIndex + 1).padStart(3, '0')}`;

//     // Student information
//     const studentName = student.name || 'Student';
//     const studentEmail = student.email || 'N/A';
//     const guardianName = student.guardianName || 'N/A';
//     const guardianPhone = student.guardianPhoneNumber || 'N/A';
//     const studentClass = student.class || 'N/A';

//     // Payment information
//     const amountPaid = payment.amount || 0;
//     const paymentMethod = payment.paymentMethod || 'N/A';
//     const remarks = payment.remarks || 'Payment completed successfully';

//     // Get logo as base64 (you might need to adjust the path resolution)
//     let logoBase64 = null;
//     try {
//       const imageSource = Image.resolveAssetSource(Lalogo);
//       const response = await fetch(imageSource.uri);
//       const blob = await response.blob();
//       logoBase64 = await new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.readAsDataURL(blob);
//       });
//     } catch (error) {
//       console.warn('Could not load logo:', error);
//     }

//     // Create HTML content with the actual logo
//     const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <title>Payment Receipt - Learners Academy</title>
//   <style>
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }

//     body {
//       font-family: 'Arial', sans-serif;
//       background-color: #ffffff;
//       padding: 0;
//       margin: 0;
//       height: 100%;
//     }

//     .receipt-container {
//       width: 100%;
//       max-width: 700px;
//       margin: 0 auto;
//       background-color: white;
//       border: 2px solid #4a90e2;
//       position: relative;
//       display: flex;
//       flex-direction: column;
//       min-height: 100vh;
//     }

//     .header {
//       background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
//       color: white;
//       padding: 20px;
//       position: relative;
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//     }

//     .logo {
//       width: 60px;
//       height: 60px;
//       background-color: white;
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       margin-right: 15px;
//       padding: 5px;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//     }

//     .logo img {
//       width: 50px;
//       height: 50px;
//       object-fit: contain;
//       border-radius: 50%;
//     }

//     .academy-title {
//       font-size: 40px;
//       font-weight: bold;
//       letter-spacing: 1px;
//       color: white;
//       flex: 1;
//       text-align: left;
//     }

//     .logo-right {
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       padding: 5px;
//       box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//     }

//     .logo-right img {
//       width: 70px;
//       height: 70px;
//       object-fit: cover;
//       border-radius: 50%;
//     }

//     .content {
//       padding: 20px;
//       background-color: #ffffff;
//       position: relative;
//       flex: 1;
//     }

//     .info-table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 20px;
//       border: 2px solid #4a90e2;
//     }

//     .info-row {
//       border-bottom: 1px solid #4a90e2;
//     }

//     .info-row:last-child {
//       border-bottom: none;
//     }

//     .info-label {
//       background-color: #ffa726;
//       color: white;
//       padding: 10px 15px;
//       font-weight: bold;
//       font-size: 13px;
//       width: 35%;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       border-right: 1px solid #4a90e2;
//     }

//     .info-value {
//       padding: 10px 15px;
//       font-size: 13px;
//       color: #333;
//       background-color: #fff;
//       font-weight: 500;
//     }

//     .watermark {
//       position: absolute;
//       top: 70%;
//       left: 50%;
//       transform: translate(-50%, -50%);
//       width: 250px;
//       height: 250px;
//       border: 8px solid rgba(74, 144, 226, 0.1);
//       border-radius: 50%;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       z-index: 1;
//       pointer-events: none;
//       opacity: 0.3;
//     }

//     .watermark img {
//       width: 300px;
//       height: 300px;
//       opacity: 0.3;
//       object-fit: contain;
//     }

//     .thank-you-section {
//       text-align: left;
//       margin: 20px 0 10px 0;
//       z-index: 2;
//       position: relative;
//     }

//     .thank-you {
//       font-size: 24px;
//       font-weight: bold;
//       color: #4a90e2;
//       margin-bottom: 5px;
//     }

//     .generated-text {
//       font-size: 11px;
//       color: #666;
//       margin-top: 5px;
//     }

//     .footer {
//       background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
//       color: white;
//       text-align: center;
//       padding: 15px;
//       position: relative;
//       margin-top: auto;
//     }

//     .footer-title {
//       font-size: 20px;
//       font-weight: bold;
//       letter-spacing: 1px;
//     }

//     .footer-subtitle {
//       font-size: 12px;
//       margin-top: 5px;
//       opacity: 0.9;
//     }

//     .content-wrapper {
//       position: relative;
//       z-index: 2;
//     }

//     @media print {
//       body {
//         background-color: white;
//         padding: 0;
//         height: 100%;
//       }

//       .receipt-container {
//         border: 2px solid #4a90e2;
//         height: 100%;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="receipt-container">
//     <!-- Header Section -->
//     <div class="header">
//       <div class="academy-title">LEARNERS ACADEMY</div>
//       <div class="logo-right">
//         ${logoBase64 ? `<img src="${logoBase64}" alt="Logo">` : '<div style="width: 50px; height: 50px; background: #4a90e2; border-radius: 50%;"></div>'}
//       </div>
//     </div>

//     <!-- Content Section -->
//     <div class="content">
//       <div class="watermark">
//         ${logoBase64 ? `<img src="${logoBase64}" alt="Watermark">` : ''}
//       </div>

//       <div class="content-wrapper">
//         <table class="info-table">
//           <tr class="info-row">
//             <td class="info-label">Name</td>
//             <td class="info-value">${studentName}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Guardian Name</td>
//             <td class="info-value">${guardianName}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Guardian Phone No</td>
//             <td class="info-value">${guardianPhone}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Class</td>
//             <td class="info-value">${studentClass}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Email</td>
//             <td class="info-value">${studentEmail}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Invoice No</td>
//             <td class="info-value">${invoiceNo}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Invoice Date</td>
//             <td class="info-value">${formattedDate}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Total Amount</td>
//             <td class="info-value">₹${feeData.totalAmount.toLocaleString('en-IN')}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Amount Paid</td>
//             <td class="info-value">₹${amountPaid.toLocaleString('en-IN')}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Pending Amount</td>
//             <td class="info-value">₹${feeData.pendingAmount.toLocaleString('en-IN')}</td>
//           </tr>
//           <tr class="info-row">
//             <td class="info-label">Payment Status</td>
//             <td class="info-value">${feeData.isFullyPaid ? 'Completed' : 'Pending'}</td>
//           </tr>
//         </table>

//         <div class="thank-you-section">
//           <div class="thank-you">THANK YOU</div>
//           <div class="generated-text">
//             Generated on: ${new Date().toLocaleDateString('en-IN', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric'
//             })}, ${new Date().toLocaleTimeString('en-IN', {
//               hour: '2-digit',
//               minute: '2-digit',
//               hour12: true
//             })}
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- Footer Section -->
//     <div class="footer">
//       <div class="footer-title">LEARNERS ACADEMY</div>
//       <div class="footer-subtitle">Excellence in Education</div>
//     </div>
//   </div>
// </body>
// </html>
//     `;

//     // Create a safe filename
//     const safeStudentName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
//     const fileName = `PaymentReceipt_${safeStudentName}_${invoiceNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

//     const options = {
//       html: htmlContent,
//       fileName: fileName,
//       directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
//     };

//     // Generate PDF
//     const file = await RNHTMLtoPDF.convert(options);
//     console.log('PDF generated at:', file.filePath);

//     if (!file.filePath) {
//       throw new Error('File path is undefined. PDF generation failed.');
//     }

//     // Handle file saving and sharing based on platform
//     if (Platform.OS === 'android') {
//       try {
//         // For Android, save to Downloads directory
//         const downloadDir = RNFS.DownloadDirectoryPath;
//         const downloadPath = `${downloadDir}/${fileName}`;

//         // Copy file to Downloads directory
//         await RNFS.copyFile(file.filePath, downloadPath);

//         ToastAndroid.show(`Receipt saved to Downloads: ${fileName}`, ToastAndroid.LONG);

//         // Share PDF
//         const base64Data = await RNFS.readFile(downloadPath, 'base64');
//         await promptSharePDF(base64Data, fileName);

//         return downloadPath;
//       } catch (error) {
//         console.error('Error saving PDF:', error);
//         // Try alternative method if first method fails
//         try {
//           // Use app's external directory as fallback
//           const pdfDir = `${RNFS.ExternalDirectoryPath}/receipts`;
//           const exists = await RNFS.exists(pdfDir);
//           if (!exists) {
//             await RNFS.mkdir(pdfDir);
//           }

//           const pdfPath = `${pdfDir}/${fileName}`;
//           await RNFS.copyFile(file.filePath, pdfPath);

//           ToastAndroid.show(`Receipt saved to app storage: ${fileName}`, ToastAndroid.LONG);

//           // Share PDF
//           const base64Data = await RNFS.readFile(pdfPath, 'base64');
//           await promptSharePDF(base64Data, fileName);

//           return pdfPath;
//         } catch (fallbackError) {
//           console.error('Fallback PDF save failed:', fallbackError);
//           ToastAndroid.show('Failed to save receipt. Please check app permissions.', ToastAndroid.LONG);
//           return file.filePath;
//         }
//       }
//     } else if (Platform.OS === 'ios') {
//       try {
//         const base64Data = await RNFS.readFile(file.filePath, 'base64');
//         await promptSharePDF(base64Data, fileName);
//         return file.filePath;
//       } catch (error) {
//         console.error('Error on iOS:', error);
//         Alert.alert('Error', 'Receipt generated but could not be shared');
//         return file.filePath;
//       }
//     }

//     return file.filePath;
//   } catch (error) {
//     console.error('Error generating receipt PDF:', error, error.stack);
//     if (Platform.OS === 'android') {
//       ToastAndroid.show('Failed to generate receipt', ToastAndroid.SHORT);
//     } else {
//       Alert.alert('Error', 'Failed to generate receipt');
//     }
//     return null;
//   }
// };

// // Function to prompt sharing options
// const promptSharePDF = async (base64Data, fileName) => {
//   try {
//     const shareOptions = {
//       title: 'Share Payment Receipt',
//       message: 'Here is your payment receipt',
//       url: `data:application/pdf;base64,${base64Data}`,
//       filename: fileName,
//       type: 'application/pdf',
//     };

//     await Share.open(shareOptions);
//   } catch (error) {
//     console.log('Error sharing file:', error);
//     // User cancelled sharing
//     if (error.message === 'User did not share') {
//       return;
//     }

//     if (Platform.OS === 'android') {
//       ToastAndroid.show('Failed to share receipt', ToastAndroid.SHORT);
//     } else {
//       Alert.alert('Error', 'Failed to share receipt');
//     }
//   }
// };

// export default generatePaymentReceiptPDF;
