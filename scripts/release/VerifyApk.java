import com.android.apksig.ApkVerifier;
import java.io.File;
import java.security.MessageDigest;
import java.security.cert.X509Certificate;

/** يتحقق من توقيع APK ويطبع بصمة SHA-256 لشهادة الموقِّع. */
public class VerifyApk {
    public static void main(String[] a) throws Exception {
        ApkVerifier.Result r = new ApkVerifier.Builder(new File(a[0])).build().verify();
        System.out.println("verified=" + r.isVerified() + " v2=" + r.isVerifiedUsingV2Scheme()
                           + " v3=" + r.isVerifiedUsingV3Scheme());
        for (X509Certificate c : r.getSignerCertificates()) {
            StringBuilder sb = new StringBuilder();
            for (byte b : MessageDigest.getInstance("SHA-256").digest(c.getEncoded())) sb.append(String.format("%02x", b));
            System.out.println("sha256=" + sb);
        }
        for (ApkVerifier.IssueWithParams e : r.getErrors()) System.out.println("ERROR " + e);
        if (!r.isVerified()) System.exit(1);
    }
}
