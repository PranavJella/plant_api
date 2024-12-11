const admin = require("firebase-admin");
const key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAf2/dxGfN+XZ9\nBlNrrAcqANwMpfB9SoWFBOI3NTxsbCaIvumeK03ZqeWNSDPaxtZPLeczMqUnzsH6\nBtBc1Hij4mXEK/gw7fHskfC2y3mmiqggz4yzjrRmeCo9+4AcPepyk09A9Ks5kCM1\nN/MoTQl/GmQquGtNDiSAopU2sW7sLZOle8IkNYRCPGHQOsxeKtY2g7tn6XXNbahM\n6a9Y7Ld7Jh/tvIlvT/pFrkC0lJRvqQHt8CLlX1VEtBeyMkwP7AWhEEBTEtVWU/uA\nl3pNtYwIiSA8Bc/QarkA7Wi3adg3xsOhU+B+uI8V+TS2/Me33bEeuvteRBvWO0cw\nUe57jyYjAgMBAAECggEAG/HkIYOjtiki5F+IuLbOi3B4gXWNhgLNg1QEKxOVZAAH\nUA63B3kt4g1h/7KdpIL9FZ2KVMpjY3YGfu+CTBekM9ZoA6SGcUP5vOgq076SOHUk\nly7KND7hPYbwSvM509/BK0TrWniqar7b/ZvTtuQIHuWL6Q/As/z7m5j+pGP5wFtU\n4MK3P4C8V4SAoV2DbMVV3YyCBKFJsoqci4Eyn8DH5yv6YBkABJ6doPW06aX2Oygj\n4OMSKHP3/jY5mxSU4vW8LclnOvde+wfKyghxFg84xVuQRVijgGDxkYSRffHf8OB2\nvbqrK0xKNIsaYRu9i3xs2556TdtId8tPGQaks8aHEQKBgQDseTUg9Up1gsMvBOOW\nf3oc6j0xgJWwZRCosbxK5fN09JCZVpWIqpCcGhY/bf9RBjUmpqD3BersskRNoq0+\nitpLC4HturZvJH7aeg944LPdV3GdNZzwYpAVopwdFudAwRMupUwSaVLulJUUnx+w\nu0G0liGpIuKyc0Arq1L89sANDwKBgQDQZKGvYnlLxJAscphcEjmc950jrXDE0f6h\netdWigXO4Kyf73rzs53+3+SyBd+V70gTpkSYbnBcPlE6H3909yQoKlAjcWHjygB0\njUCCMVElO0fm4cpq1mfMJepRv4Zcn4lY3hI4ldCt4g/u5nU1XAZezKO1rIL719++\nyVkzADp9rQKBgBRsM2ZxSMj1Th4VcgJhaA5vPHG2BTeCwvmOwBBH48rKBGL501hG\nQs74gctgmJhKzPRVl7k9zZg7nSKHVib8nvW0PLhnU7ItmLcNq6Bo55/KGYnWQ4OP\nP5pevNTWUYqKIjn5FKTSa9MnCekKBRaiVX5fKPEOjj2TLouW9Efcl6GJAoGBAMwL\nDEj2qX9neicbGVVlPuYTiNgLFZSRbLld1wTT5fX3BO8ghAmkQDnzrTAmEhLzlGYw\n8Y8y629WUSARATJcXhm5vHfHp6pq+mEkgRo5AZPr5G4LfK95OW6pXTInzn5YcxoB\nbmPbRNVMuH8ZRYA2l8IwqsbSn/nJGDntWhpWye6NAoGBAMEdJWZw8EwSXApRaaag\nzy1ag6bTdbaNhjSJJJLS2pAmevin0QxlG16hjeMU6ZxSDMet57oepIAhS0cCbzhB\nPLxqNGkg1nsQGVzO5dSCCFnY72moS5GwFEjs8cat3N3igMPXrpzG3haXqTfqytg2\nPwfCo+g8H0T0YQUc/CrDeq3B\n-----END PRIVATE KEY-----\n"
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: "plant-app-76edb",
        privateKey: key.replace(/\\n/g, '\n'), // Fixes multiline private key
        clientEmail: "firebase-adminsdk-apr9n@plant-app-76edb.iam.gserviceaccount.com",
    }),
    storageBucket: "plant-app-76edb.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };