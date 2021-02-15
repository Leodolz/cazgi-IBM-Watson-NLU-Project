import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      return (  
        <div>
          <table className="table table-bordered">
            <tbody>
            {
                this.getMappedEmotions()
            }
            </tbody>
          </table>
          </div>
          );
        }

    getMappedEmotions()
    {
        let emotionsArray = Object.entries(this.props.emotions);
        return emotionsArray.map((emotionItem) => {
            return <tr>
                <td>{emotionItem[0]}</td>
                <td>{emotionItem[1]}</td>
            </tr>;
        });
    }
    
}
export default EmotionTable;
