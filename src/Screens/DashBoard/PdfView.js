import React, {
    Component,
    PropTypes,
} from 'react';

import {
    StyleSheet,
    View
} from 'react-native';

import PDFView from 'react-native-pdf-view';
import { WebView } from 'react-native-webview';

const PdfView = () => {
    let docUrl = "http://docs.google.com/gview?embedded=true&url="
    let pdfUrl = "http://www.africau.edu/images/default/sample.pdf";
    return (

        <WebView
            style={{ flex: 1, backgroundColor: 'white' }}
            source={{
                uri: docUrl + pdfUrl,
            }}
            bounces={true}
            useWebKit={true}
            scrollEnabled={true}
        />
        // <PDFView ref={(pdf) => { this.pdfView = pdf; }}
        //     src={pdfUrl}
        //     onLoadComplete={(pageCount) => {
        //         this.pdfView.setNativeProps({
        //             zoom: 1.5
        //         });
        //     }}
        //     style={styles.pdf} />
    )
}

export default PdfView
var styles = StyleSheet.create({
    pdf: {
        flex: 1
    }
});