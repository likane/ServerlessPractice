import React from "react";
import {API, graphqlOperation} from 'aws-amplify'
import {getMarket} from '../graphql/queries'
import { Loading, Tabs, Icon } from "element-react";
import {Link} from 'react-router-dom'

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true
  };

  componentDidMount() {
    this.handleGetMarket();
  }


  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId
    }
    const result = await API.graphql(graphqlOperation(getMarket, input))
    console.log(result)
    this.setState({market: result.data.getMarket, isLoading: false});
  }

  render() {
    const {market, isLoading} = this.state;
    return isLoading ? (
      <Loading fullscreen={true}/>
    ) : (
      <>
        <Link className="link" to='/'>
        Back to Markets List
        </Link>

        <span className="items-center pt-2">
          <h2 className="mb-mr">{market.name}</h2>- {MarketPage.owner}
        </span>

        <div className="items-center pt-2">
          <span style={{color: 'var(--lightSquidInk)', paddingBottom: '1em'}}>
            <Icon name="date" className="icon">
              {market.createdAt}
            </Icon>
          </span>
        </div>
      </>
    )
  }
}

export default MarketPage;
