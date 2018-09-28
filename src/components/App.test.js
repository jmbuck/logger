import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from "./App";

Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
   beforeAll(() => {
       firebase.firebase.auth = jest.fn().mockReturnValue({
           onAuthStateChanged: true
       });
   });
    it("should create component", () => {

        const component = Enzyme.shallow(<App />);

        console.log(component.toJSON());

        let tree = component.toJSON();

        expect(tree).toMatchSnapshot();
    });
});

