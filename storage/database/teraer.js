import db from '../cloud'

const teraer = db.collection('teraer');
teraer.add({
	data: {
		idPrivateKey: '',
		idPublicKey: '',
	}
})
