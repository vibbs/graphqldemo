const axios = require('axios');

const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require('graphql');

//Hard coded data
// const customers =[
// 	{id:'1', name:'vaibhav', email : 'vibbs@test.com', age : 29},
// 	{id:'2', name:'Pranav', email : 'Pranav@test.com', age : 23},
// 	{id:'3', name:'Rahul', email : 'Rahul@test.com', age : 26},
// 	{id:'4', name:'Chirs', email : 'Chirs@test.com', age : 23}
// ]




//Customer type
const CustomerType = new GraphQLObjectType({
	name: 'Customer',
	fields : () => ({
		id:{type: GraphQLString},
		name : {type :GraphQLString},
		email : {type :GraphQLString},
		age : {type :GraphQLInt},

	})
});


//Root query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields : () => ({
		customer : {
			type:  CustomerType,
			args: {
				id: {type: GraphQLString}
			},
			resolve (parentValue, args) {
				// for(let i =0 ; i < customer.length ; i++){
				// 	if(customer[i].id == args.id ){
				// 		return customer[i];
				// 	}
				// }

				return axios.get('http://localhost:3000/customers/'+args.id)
						.then(res => res.data);
			}
		},
		customers : {
			type : new GraphQLList(CustomerType),
			resolve(parentValue, args){
				return axios.get('http://localhost:3000/customers/')
						.then(res => res.data);
			}
		}
	})
	
});

//Mutatitons
const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields : {
		addCustomer : {
			type :CustomerType,
			args : {
				name : {type : new GraphQLNonNull(GraphQLString)},
				email : {type : new GraphQLNonNull(GraphQLString)},
				age : {type : new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parentValue, args){
				return axios.post('http://localhost:3000/customers', {
					name : args.name,
					email : args.email,
					age : args.age
				}).then(res => res.data);
			}
		},
		editCustomer : {
			type :CustomerType,
			args : {
				id : {type : new GraphQLNonNull(GraphQLString)},
				name : {type : GraphQLString},
				email : {type : GraphQLString},
				age : {type : GraphQLInt}
			},
			resolve(parentValue, args){
				return axios.patch('http://localhost:3000/customers/'+args.id, args)
				.then(res => res.data);
			}
		},
		deleteCustomer : {
			type :CustomerType,
			args : {
				id : {type : new GraphQLNonNull(GraphQLString)}
			},
			resolve(parentValue, args){
				return axios.delete('http://localhost:3000/customers/'+args.id)
				.then(res => res.data);
			}
		}
	}
});


module.exports= new GraphQLSchema({
	query: RootQuery,
	 mutation
});










