import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import MarketOrder from './marketOrder.jsx';
import CheckBox from './checkbox.jsx';
import LimitOrder from './limitOrder.jsx';
import StopLossOrder from './stopLossOrder.jsx';
import StopLimitOrder from './stopLimitOrder.jsx';
import Message from './message.jsx';
import TrailingStopOrder from './trailingStopOrder.jsx';
import DropDown from './dropdown.jsx';
import Wrapper from './styles/mainWrapper/wrapper';
import InputWrapper from './styles/inputWrapper/inputWrapper';
import WarningWrapper from './styles/Messages/wrapper';
import Span from './styles/Span/span';
import GlobalStyle from './styles/globalStyle';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const MarketPrice = styled.div`
  width: 220px;
  margin: auto;
  padding: 10px;
  text-align: center;
`;


const EstimateWrapper = styled(InputWrapper)`
    border-top: 1px solid black;
`;

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      ticker: '',
      bp: 0,
      shares: 0,
      price: 0,
      estimate: 0,
      type: 'Buy',
      tab: 'Market Order',
      menu: false,
      orderPlaced: false,
      showWarning: false,
    };

    this.estimateHandler = this.estimateHandler.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
    this.menuHandler = this.menuHandler.bind(this);
    this.orderHandler = this.orderHandler.bind(this);
  }

  componentDidMount() {
    axios.get('/api/F')
      .then((response) => {
        const { user, stock } = response.data;
        this.setState({
          ticker: stock.ticker,
          bp: 1000,
          shares: 0,
          // bp: user.funds,
          // shares: user.shares,
          price: stock.price,
        });
      })
      .catch((err) => console.log(err));
  }

  estimateHandler(estimate) {
    this.setState({
      estimate,
    });
  }

  menuHandler() {
    this.setState({
      menu: !this.state.menu,
    });
  }

  tabHandler(e) {
    this.setState({
      tab: e.target.innerText,
      menu: !this.state.menu,
      estimate: 0,
    });
  }

  orderHandler() {
    if (this.state.estimate > 0) {
      this.setState({
        orderPlaced: !this.state.orderPlaced,
        showWarning: false,
      });
    } else {
      this.setState({
        showWarning: true,
      });
    }
  }

  renderTab() {
    const { tab } = this.state;
    if (tab === 'Market Order') {
      return <MarketOrder price={this.state.price} estimateHandler={this.estimateHandler} />;
    } else if (tab === 'Limit Order') {
      return <LimitOrder estimateHandler={this.estimateHandler} />;
    } else if (tab === 'Stop Loss Order') {
      return <StopLossOrder estimateHandler={this.estimateHandler} />;
    } else if (tab === 'Stop Limit Order') {
      return <StopLimitOrder estimateHandler={this.estimateHandler} />;
    } else if (tab === 'Trailing Stop Order') {
      return <TrailingStopOrder estimateHandler={this.estimateHandler}
              price={this.state.price} />;
    }
  }

  render() {
    const { tab } = this.state;
    return (
      <AppWrapper>
          <GlobalStyle />
          <Wrapper>
              <Wrapper.Header>
                  <Wrapper.H1>Buy {this.state.ticker}</Wrapper.H1>
                  <Wrapper.MenuIcon onClick={this.menuHandler}>...</Wrapper.MenuIcon>
                  {this.state.menu &&
                  <DropDown tab={this.state.tab} tabHandler={this.tabHandler}></DropDown>}
              </Wrapper.Header>
              {this.renderTab()}
              <EstimateWrapper>
                  <Span>Estimated Cost</Span>
                  <Span.Value>${this.state.estimate}</Span.Value>
              </EstimateWrapper>
              {tab === 'Limit Order' && <CheckBox/>}
              {tab !== 'Market Order' &&
              <MarketPrice>
                <Span.Color>Market Price ${this.state.price}</Span.Color>
              </MarketPrice>
              }
              {this.state.orderPlaced &&
              <Message estimate={this.state.estimate} bp={this.state.bp}
              ticker={this.state.ticker} shares={this.state.shares}
              orderHandler={this.orderHandler}/>}
              {this.state.showWarning &&
              <WarningWrapper>
                (!) Error<br></br>
                Please enter a valid number of shares.
              </WarningWrapper>}
              {!this.state.orderPlaced &&
              <Wrapper.Button onClick={this.orderHandler}>Review Order</Wrapper.Button>}
              <Wrapper.Footer>
                  <Span.Color>${this.state.bp} Buying Power Available</Span.Color>
              </Wrapper.Footer>
          </Wrapper>
      </AppWrapper>
    );
  }
}

export default App;
