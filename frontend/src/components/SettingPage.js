import Header from "./Header";
import Setting from "./Setting";

const SettingPage = ({groupomania, user, disconnected}) => {
    return (
        <>
            <Header />
            <div className={'wrapper'}>
                <Setting disconnected={disconnected} groupomania={groupomania} user={user} />
            </div>
        </>
    )
}

export default SettingPage
