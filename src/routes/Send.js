import React from 'react';
import styled from 'styled-components';
import { FormInput } from '../components/formInput';
import {ethers} from "ethers"
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: white;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 6px 20px;
  margin: 8px 0;
  font-size: 16px;
  font-weight: 300;
  color: #333;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

const SendContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid #ccc;
  padding: 12px 20px;
  margin: 10px;
`;

const SubmitButton = styled.button`
  display: flex;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin: 8px 0;
  font-size: 16px;
  font-weight: 300;
  cursor: pointer;
  &:hover {
    background-color: #00264d;
  }
`;

const RedErrorText = styled.p`
  color: red;
`;

function Send() {
  const [data, setData] = React.useState({
    deposit: {
      amount: undefined,
      error: '',
      isLoading: false,
    },
    wallet: {
      account: undefined,
      id: undefined,
      chain: undefined,
      balance: undefined,
      error: '',
      contract: undefined,
    },
    approve: {
      spendingId: undefined,
      error: '',
      isLoading: false,
      vote: undefined,
    },
    spending: {
      purpose: '',
      amount: undefined,
      receiver: '',
      error: '',
      isLoading: false,
    },
    execute: {
      spendingId: undefined,
      error: '',
      isLoading: false,
    },
  });

  React.useEffect(() => {
    if(data.wallet.account && ethers.utils.isAddress(data.wallet.account) && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const abi = [
        "function deposit(uint depositAmt) public payable",
        "function createSpending(address _receiver, uint spendingAmt, string memory purpose) public",
        "function approveSpending(uint spendingId, bool vote) public",
        "function executeSpending(uint spendingId) public",
      ];
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      setData({
        ...data,
        wallet: {
          ...data.wallet,
          contract: contract,
        }
      })
      provider.getBalance(data.wallet.account).then((result)=> {
        setData({
          ...data,
          wallet: {
            ...data.wallet,
            balance: result.toString(),
            contract: contract,
          }
        })
      })
      provider.getNetwork().then((result)=>{
        setData({
          ...data,
          wallet: {
            ...data.wallet,
            id: result.chainId,
            chain: result.name,
            contract: contract,
          }
        })
      })

    } else {
      setData({
        ...data,
        wallet: {
          ...data.wallet,
          error: 'Please connect your wallet.',
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.wallet.account]);

  const deposit = async () => {
    if(!data.wallet.account) {
      setData({
        ...data,
        deposit: {
          ...data.deposit,
          error: 'Please connect your wallet',
        }
      })
      return;
    }

    if(!data.deposit.amount) {
      setData({
        ...data,
        deposit: {
          ...data.deposit,
          error: 'Please enter an amount',
        }
      })
      return;
    }

    try {
      const gasPrice = ethers.utils.parseUnits('0.000000002', 'ether')
      const tx = await data.wallet.contract.deposit(ethers.utils.parseEther(data.deposit.amount), {
        gasPrice: gasPrice,
        value: ethers.utils.parseEther(data.deposit.amount),
      })
      console.log(tx)
      setData({
        ...data,
        deposit: {
          ...data.deposit,
          isLoading: true,
        }
      });
      const receipt = await tx.wait();
      console.log(receipt)
      if(receipt.status === 1) {
        setData({
          ...data,
          deposit: {
            ...data.deposit,
            error: '',
            isLoading: false,
            amount: undefined,
          }
        });
      } else {
        setData({
          ...data,
          deposit: {
            ...data.deposit,
            isLoading: false,
            error: 'Transaction failed' + receipt.status,
          }
        });
      }
    }
    catch (e) {
      console.log(e)
      setData({
        ...data,
        deposit: {
          ...data.deposit,
          isLoading: false,
          error: e.reason ?? e.message,
        }
      })
    }
  };

  const createSpending = async () => {
    if(!data.wallet.account) {
      setData({
        ...data,
        spending: {
          ...data.spending,
          error: 'Please connect your wallet',
        }
      })
      return;
    }

    if(!data.spending.purpose || !data.spending.amount || !data.spending.receiver) {
      setData({
        ...data,
        spending: {
          ...data.spending,
          error: 'Please fill out all fields',
        }
      })
      return;
    }

    try {
      const gasPrice = ethers.utils.parseUnits('0.000000002', 'ether')
      const tx = await data.wallet.contract.createSpending(
        data.spending.receiver,
        ethers.utils.parseEther(data.spending.amount),
        data.spending.purpose,
        {
          gasPrice: gasPrice,
        }
      )
      console.log(tx)
      setData({
        ...data,
        spending: {
          ...data.spending,
          isLoading: true,
        }
      });
      const receipt = await tx.wait();
      console.log(receipt)
      if(receipt.status === 1) {
        setData({
          ...data,
          spending: {
            ...data.spending,
            error: '',
            isLoading: false,
            purpose: '',
            amount: undefined,
            receiver: '',
          }
        });
      } else {
        setData({
          ...data,
          spending: {
            ...data.spending,
            isLoading: false,
            error: 'Transaction failed' + receipt.status,
          }
        });
      }
    }
    catch (e) {
      console.log(e)
      setData({
        ...data,
        spending: {
          ...data.spending,
          isLoading: false,
          error: e.reason ?? e.message,
        }
      })
    }
  };

  const approveSpending = async () => {
    if(!data.wallet.account) {
      setData({
        ...data,
        approve: {
          ...data.approve,
          error: 'Please connect your wallet',
        }
      })
      return;
    }

    if(!data.approve.spendingId) {
      setData({
        ...data,
        approve: {
          ...data.approve,
          error: 'Please enter a spending ID',
        }
      })
      return;
    }

    if(!data.approve.vote) {
      setData({
        ...data,
        approve: {
          ...data.approve,
          error: 'Please check the box to approve',
        }
      })
      return;
    }

    try {
      const gasPrice = ethers.utils.parseUnits('0.000000002', 'ether')
      const tx = await data.wallet.contract.approveSpending(
        data.approve.spendingId,
        data.approve.vote,
        {
          gasPrice: gasPrice,
        }
      )
      console.log(tx)
      setData({

        ...data,
        approve: {
          ...data.approve,
          isLoading: true,
        }
      });

      const receipt = await tx.wait();
      console.log(receipt)
      if(receipt.status === 1) {
        setData({
          ...data,
          approve: {
            ...data.approve,
            error: '',
            isLoading: false,
            spendingId: undefined,
            vote: undefined,
          }
        });
      } else {
        setData({
          ...data,
          approve: {
            ...data.approve,
            isLoading: false,
            error: 'Transaction failed' + receipt.status,
          }
        });
      }
    }
    catch (e) {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      setData({
        ...data,
        approve: {
          ...data.approve,
          isLoading: false,
          error: e.reason ?? e.message,
        }
      })
    }
  };


  const executeSpending = async () => {
    if(!data.wallet.account) {
      setData({
        ...data,
        execute: {
          ...data.execute,
          error: 'Please connect your wallet',
        }
      })
      return;
    }

    if(!data.execute.spendingId) {
      setData({
        ...data,
        execute: {
          ...data.execute,
          error: 'Please enter a spending ID',
        }
      })
      return;
    }

    try {
      const gasPrice = ethers.utils.parseUnits('0.000000002', 'ether')
      const tx = await data.wallet.contract.executeSpending(
        data.execute.spendingId,
        {
          gasPrice: gasPrice,
        }
      )
      console.log(tx)
      setData({

        ...data,
        execute: {
          ...data.execute,
          isLoading: true,
        }
      });

      const receipt = await tx.wait();
      console.log(receipt)
      if(receipt.status === 1) {
        setData({
          ...data,
          execute: {
            ...data.execute,
            error: '',
            isLoading: false,
            spendingId: undefined,
          }
        });
      } else {
        setData({
          ...data,
          execute: {
            ...data.execute,
            isLoading: false,
            error: 'Transaction failed' + receipt.status,
          }
        });
      }
    }
    catch (e) {
      const error = JSON.parse(JSON.stringify(e))
      console.log(error)
      setData({
        ...data,
        execute: {
          ...data.execute,
          isLoading: false,
          error: e.reason ?? e.message,
        }
      })
    }
  };

  const connect = async () => {
    if(window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setData({
          ...data,
          wallet: {
            ...data.wallet,
            account: accounts[0],
            error: '',
          }
        })
      } catch (error) {
        setData({
          ...data,
          wallet: {
            ...data.wallet,
            error: error.reason ?? error.message,
          }
        })
      }
    } else {
      setData({
        ...data,
        wallet: {
          ...data.wallet,
          error: 'No Ethereum wallet detected',
        }
      })
    }
  }

  return (
      <>
        <Card>
          <h2>Wallet</h2>
          <SubmitButton
            onClick={() => {
              if (!data.wallet.account) {
                connect()
              }
            }}
          >
            {data.wallet.account ? 'Connected' : 'Connect'}
          </SubmitButton>
          <p>Contract Address: {CONTRACT_ADDRESS}</p>
            {data.wallet.account && `Account: ${data.wallet.account}`} <br />
            {data.wallet.account && data.wallet.balance && ` (${ethers.utils.formatEther(data.wallet.balance)} ETH)`}<br />
            {data.wallet.account && data.wallet.chain && ` on ${data.wallet.chain}`}<br />
            {data.wallet.account && data.wallet.id && ` (${data.wallet.id})`}<br />
            {data.wallet.error && `Error: ${data.wallet.error}`}<br />
        </Card>
        <Card>
          <h2>Deposit</h2>
          <SendContainer>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                deposit();
              }}
            >
              <FormInput
                isDark
                label="Amount"
                id="amount-dep"
                disabled={data.deposit.isLoading}
                value={data.deposit.amount}
                onChange={(e) => setData({
                  ...data,
                  deposit: {
                    ...data.deposit,
                    amount: e.target.value
                  }
                })}
                placeholder="Enter the amount to send"
              />
              {data.deposit.error && <RedErrorText>{data.deposit.error}</RedErrorText>}
              <SubmitButton
                disabled={data.deposit.isLoading}
                type="submit"
              >
                {data.deposit.isLoading ? 'Confirming...' : 'Deposit'}
              </SubmitButton>
            </form>
          </SendContainer>
        </Card>
        <Card>
          <h2>Vote for Spending Requests</h2>
          <SendContainer>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                approveSpending();
              }}
            >
              <FormInput
                isDark
                label="Spending ID"
                id="spending-id"
                value={data.approve.spendingId}
                onChange={(e) => {
                  setData({
                    ...data,
                    approve: {
                      ...data.approve,
                      spendingId: e.target.value,
                    }
                  })
                }}
                disabled={data.approve.isLoading}
                placeholder="Enter the ID of the spending request"
              />
              <FormInput
                isDark
                label="Vote"
                value={data.approve.vote}
                type="checkbox"
                id="vote-chec"
                disabled={data.approve.isLoading}
                onChange={(e) => {
                  setData({
                    ...data,
                    approve: {
                      ...data.approve,
                      vote: e.target.checked
                    }
                  })
                }}
              />
              {data.approve.error && <RedErrorText>{data.approve.error}</RedErrorText>}
              <SubmitButton
                type="submit"
                disabled={data.approve.isLoading}
              >
                {data.approve.isLoading ? 'Confirming...' : 'Vote'}
              </SubmitButton>
            </form>
          </SendContainer>
        </Card>
        <Card>
          <h2>Execute Spending</h2>
          <SendContainer>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSpending();
              }}
            >
              <FormInput
                isDark
                label="Spending ID"
                id="spending-id-ex"
                value={data.execute.spendingId}
                onChange={(e) => {
                  setData({
                    ...data,
                    execute: {
                      ...data.execute,
                      spendingId: e.target.value
                    }
                  })
                }}
                disabled={data.execute.isLoading}
                placeholder="Enter the ID of the spending request"
              />
              {data.execute.error && <RedErrorText>{data.execute.error}</RedErrorText>}
              <SubmitButton
                type="submit"
                disabled={data.execute.isLoading}
              >
                {data.execute.isLoading ? 'Confirming...' : 'Execute'}
              </SubmitButton>
            </form>
          </SendContainer>
        </Card>
        <Card>
          <h2>Spending Request</h2>
          <SendContainer>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createSpending();
              }}
            >
            <FormInput
              isDark
              label="Spending Purpose"
              id="spending-purpose"
              disabled={data.spending.isLoading}
              value={data.spending.purpose}
              onChange={(e) => setData({
                ...data,
                spending: {
                    ...data.spending,
                    purpose: e.target.value
                }
              })}
              placeholder="Enter the purpose"
            />
              <FormInput
                isDark
                label="Receiver"
                id="spending-receiver"
                disabled={data.spending.isLoading}
                value={data.spending.receiver}
                onChange={(e) => setData({
                  ...data,
                  spending: {
                      ...data.spending,
                      receiver: e.target.value
                  }
                })}
                placeholder="Enter the address of the receiver"
              />
              <FormInput
                isDark
                label="Spending Amount"
                disabled={data.spending.isLoading}
                id="spending-amount"
                value={data.spending.amount}
                onChange={(e) => setData({
                  ...data,
                  spending: {
                      ...data.spending,
                      amount: e.target.value
                  }
                })}
                placeholder="Enter the amount to send"
              />
              {data.spending.error && <RedErrorText>{data.spending.error}</RedErrorText>}
              <SubmitButton
                type="submit"
                disabled={data.spending.isLoading}
              >
                {data.spending.isLoading ? 'Confirming...' : 'Create Spending Request'}
              </SubmitButton>
            </form>
          </SendContainer>
        </Card>
      </>
  );
}

export default Send;
