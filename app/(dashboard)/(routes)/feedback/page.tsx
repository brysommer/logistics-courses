

import ContactForm from "./_components/contact-form";

const FeedBack = () => {


    return ( 
        <div>
            <ContactForm
                serviceId={process.env.REACT_APP_SERVICE_ID!}
                templateId={process.env.REACT_APP_TEMPLATE_ID!}
                publicKey={process.env.REACT_APP_PUBLIC_KEY!}
            />
        </div>
     );
}
 
export default FeedBack;
